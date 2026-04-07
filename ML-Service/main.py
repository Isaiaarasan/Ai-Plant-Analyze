from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import io
import time
from model import predict_image

app = FastAPI(title="Ai-Plant-Analyze ML Service", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Plant analysis ML service is running."}

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    """
    Accepts an uploaded image and runs it through the ML model.
    """
    start_time = time.time()
    try:
        # Read image content
        image_bytes = await image.read()
        
        # Run prediction
        result = predict_image(image_bytes)
        
        # Add metadata
        result["analysis_time_ms"] = int((time.time() - start_time) * 1000)
        
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        print(f"Server error during analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # In a real setup, this would be controlled via command line or Docker
    uvicorn.run(app, host="0.0.0.0", port=8000)
