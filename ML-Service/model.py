import tensorflow as tf
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.applications import MobileNetV2
import numpy as np
from PIL import Image
import io

# Define common plant diseases for classification
# These are representative classes; in a real scenario, this would match the training set.
CLASSES = [
    "Healthy",
    "Tomato_Bacterial_spot",
    "Tomato_Early_blight",
    "Tomato_Late_blight",
    "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot",
    "Tomato_Spider_mites_Two-spotted_spider_mite",
    "Tomato_Target_Spot",
    "Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato_mosaic_virus",
    "Potato_Early_blight",
    "Potato_Late_blight",
    "Potato_Healthy",
    "Apple_Black_rot",
    "Apple_Cedar_apple_rust",
    "Apple_Healthy",
    "Corn_Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn_Common_rust_",
    "Corn_Northern_Leaf_Blight",
    "Corn_Healthy"
]

def create_model(num_classes):
    """
    Creates a new ML model using Transfer Learning on MobileNetV2.
    This architecture is lightweight and suitable for image classification tasks.
    """
    # Load the base model with pre-trained ImageNet weights
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base model to use it as a feature extractor initially
    base_model.trainable = False
    
    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.2)(x)
    x = Dense(512, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    # This is the final model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    return model

# Global model instance
model = None

def load_or_init_model():
    global model
    if model is None:
        print("Initializing new ML model...")
        model = create_model(len(CLASSES))
        # In a real app, you would load weights here if you had them:
        # model.load_weights('plant_disease_model.h5')
        print("Model initialized successfully.")
    return model

def pre_process_image(image_bytes):
    """
    Pre-processes the uploaded image to be compatible with the model input.
    """
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0  # Normalize to [0,1]
    
    # Ensure 3 channels
    if img_array.shape[-1] == 4:
        img_array = img_array[..., :3]
    elif len(img_array.shape) == 2:
        img_array = np.stack([img_array]*3, axis=-1)
        
    img_array = np.expand_dims(img_array, axis=0) # Add batch dimension
    return img_array

def predict_image(image_bytes):
    """
    Runs the inference on the image and returns the classification result.
    """
    try:
        current_model = load_or_init_model()
        processed_image = pre_process_image(image_bytes)
        
        # Perform prediction
        predictions = current_model.predict(processed_image)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        disease_name = CLASSES[class_idx]
        
        # Heuristic severity/treatment mapping for dummy predictions
        # In a real scenario, this would be based on the identified disease
        severity = "low"
        if "blight" in disease_name.lower() or "virus" in disease_name.lower():
            severity = "high"
        elif "spot" in disease_name.lower() or "rust" in disease_name.lower():
            severity = "medium"
            
        health_score = int(100 if disease_name == "Healthy" else (1.0 - confidence) * 100)
        health_score = max(10, min(100, health_score)) # normalize
        
        return {
            "disease": disease_name,
            "confidence": int(confidence * 100),
            "severity": severity,
            "healthScore": health_score,
            "treatment": get_treatment(disease_name),
            "prevention": get_prevention(disease_name)
        }
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {
            "error": str(e),
            "disease": "Unknown",
            "confidence": 0,
            "severity": "unknown",
            "healthScore": 0,
            "treatment": "Could not identify.",
            "prevention": "N/A"
        }

def get_treatment(disease):
    treatments = {
        "Tomato_Bacterial_spot": "Apply copper-based fungicides. Remove infected leaves immediately.",
        "Tomato_Early_blight": "Increase air circulation. Use fungicides containing chlorothalonil or mancozeb.",
        "Tomato_Late_blight": "Extremely contagious. Use systemic fungicides and improve drainage.",
        "Potato_Late_blight": "Destroy infected tubers. Apply preventive fungicides during humid weather.",
        "Healthy": "No treatment needed. Continue current Care routine.",
        "Apple_Black_rot": "Prune out infected branches and remove mummified fruit.",
        "Apple_Cedar_apple_rust": "Plant resistant varieties and remove nearby Juniper trees if possible."
    }
    return treatments.get(disease, "Identify specific pest or fungus and apply appropriate organic/chemical treatment.")

def get_prevention(disease):
    if disease == "Healthy":
        return "Regular watering, soil monitoring, and balanced fertilization."
    return "Ensure proper plant spacing, avoid overhead watering, and use crop rotation in next season."
