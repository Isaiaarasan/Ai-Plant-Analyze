const Disease = require('../models/Disease');

// @desc    Get solutions for a specific disease
// @route   GET /api/solutions/:diseaseName
// @access  Private
const getSolutionsByDisease = async (req, res) => {
  try {
    const { diseaseName } = req.params;
    
    // Find disease in database
    const disease = await Disease.findOne({ name: { $regex: new RegExp(diseaseName, 'i') } });
    
    if (!disease) {
      // If disease not found in DB, return mock data
      // In a production app, you'd want to handle this differently
      const mockSolutions = getMockSolutions(diseaseName);
      return res.json(mockSolutions);
    }
    
    res.json({
      name: disease.name,
      scientificName: disease.scientificName,
      description: disease.description,
      symptoms: disease.symptoms,
      causes: disease.causes,
      treatment: disease.treatment,
      prevention: disease.prevention,
      severity: disease.severity
    });
  } catch (error) {
    console.error('Get solutions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all diseases
// @route   GET /api/solutions
// @access  Private
const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find().select('name severity');
    
    if (diseases.length === 0) {
      // If no diseases in DB, return mock data
      return res.json(getMockDiseasesList());
    }
    
    res.json(diseases);
  } catch (error) {
    console.error('Get all diseases error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get mock solutions for demo purposes
const getMockSolutions = (diseaseName) => {
  const mockDiseases = {
    'powdery mildew': {
      name: 'Powdery Mildew',
      scientificName: 'Erysiphales',
      description: 'Powdery mildew is a fungal disease that affects a wide range of plants. It appears as a white to gray powdery growth on leaf surfaces, stems, and sometimes fruit.',
      symptoms: [
        'White or gray powdery spots on leaves and stems',
        'Distorted or stunted growth',
        'Yellowing leaves that may die prematurely',
        'Reduced yield and quality of fruits or flowers'
      ],
      causes: 'Powdery mildew fungi thrive in environments with high humidity and moderate temperatures. Unlike many fungal pathogens, they don\'t require standing water to germinate and infect plants.',
      treatment: 'Apply fungicides containing sulfur, neem oil, or potassium bicarbonate. For organic options, try a mixture of 1 tablespoon baking soda, 1/2 teaspoon liquid soap, and 1 gallon of water as a spray. Remove and destroy heavily infected plant parts.',
      prevention: 'Plant resistant varieties when available. Ensure good air circulation by proper spacing and pruning. Avoid overhead watering and water in the morning so plants can dry during the day. Keep the growing area clean of plant debris.',
      severity: 'medium'
    },
    'leaf spot': {
      name: 'Leaf Spot',
      scientificName: 'Various fungi and bacteria',
      description: 'Leaf spot is a common term for a group of diseases affecting plants, characterized by spots on foliage. The diseases are caused by various fungi and bacteria.',
      symptoms: [
        'Spots on leaves that may be brown, black, tan, or red',
        'Spots may have a yellow halo',
        'Severely affected leaves may yellow and drop prematurely',
        'In severe cases, the plant may be defoliated'
      ],
      causes: 'Leaf spot diseases are typically caused by fungi or bacteria that thrive in wet, humid conditions. Spores are spread by wind, water, insects, or gardening tools.',
      treatment: 'Remove and destroy infected leaves. Apply appropriate fungicides or bactericides depending on the specific pathogen. Copper-based products can be effective for many leaf spot diseases.',
      prevention: 'Avoid overhead watering. Ensure adequate spacing between plants for good air circulation. Practice crop rotation. Keep the garden clean of debris. Use disease-free seeds and plants.',
      severity: 'medium'
    },
    'rust': {
      name: 'Rust',
      scientificName: 'Pucciniales',
      description: 'Rust is a fungal disease that affects many plants, characterized by rusty-colored spots on leaves and stems. There are many species of rust fungi, each specialized to infect specific plants.',
      symptoms: [
        'Orange, yellow, or brown pustules on leaves, stems, or fruit',
        'Pustules release powdery spores when touched',
        'Distorted growth or withering of affected parts',
        'Premature leaf drop in severe infections'
      ],
      causes: 'Rust fungi require living plant tissue to grow. They thrive in humid conditions and moderate temperatures. Many rust species require alternate hosts to complete their life cycle.',
      treatment: 'Remove and destroy infected plant parts. Apply fungicides containing sulfur, copper, or specific synthetic fungicides labeled for rust control. Begin treatment at the first sign of disease.',
      prevention: 'Choose resistant varieties when available. Avoid wetting the foliage when watering. Ensure good air circulation. Remove alternate host plants if applicable. Practice crop rotation.',
      severity: 'medium'
    },
    'blight': {
      name: 'Blight',
      scientificName: 'Various fungi and bacteria',
      description: 'Blight is a general term for a rapid and severe disease that affects plants, typically causing sudden wilting and death of foliage, flowers, and stems.',
      symptoms: [
        'Rapid browning and death of leaves, stems, or flowers',
        'Water-soaked spots that enlarge quickly',
        'Wilting despite adequate soil moisture',
        'Dark, sunken cankers on stems or fruit'
      ],
      causes: 'Blight can be caused by various fungi and bacteria. Many blight pathogens thrive in cool, wet conditions and can spread rapidly during rainy periods.',
      treatment: 'Remove and destroy infected plant parts. Apply appropriate fungicides or bactericides depending on the specific pathogen. Copper-based products can help prevent bacterial blights.',
      prevention: 'Use disease-resistant varieties when available. Ensure good air circulation. Avoid overhead watering. Practice crop rotation. Remove plant debris at the end of the growing season.',
      severity: 'high'
    },
    'aphids': {
      name: 'Aphids',
      scientificName: 'Aphidoidea',
      description: 'Aphids are small sap-sucking insects that can cause significant damage to plants. They often cluster on new growth and the undersides of leaves.',
      symptoms: [
        'Curled, stunted, or yellowing leaves',
        'Sticky honeydew on leaves or ground',
        'Black sooty mold growing on honeydew',
        'Presence of small, pear-shaped insects on plants'
      ],
      causes: 'Aphids reproduce rapidly in warm weather. They are often attracted to plants with soft new growth or those stressed by drought or improper fertilization.',
      treatment: 'Spray plants with strong water jets to dislodge aphids. Apply insecticidal soap, neem oil, or horticultural oil. For severe infestations, consider systemic insecticides.',
      prevention: 'Encourage beneficial insects like ladybugs and lacewings. Avoid excessive nitrogen fertilization which promotes soft, attractive growth. Use reflective mulches to confuse aphids.',
      severity: 'medium'
    },
    'healthy': {
      name: 'Healthy Plant',
      scientificName: 'N/A',
      description: 'Your plant appears to be healthy with no signs of disease or pest infestation.',
      symptoms: ['No symptoms of disease or pest damage detected'],
      causes: 'N/A',
      treatment: 'No treatment needed. Continue with regular plant care practices.',
      prevention: 'Maintain good gardening practices: proper watering, appropriate fertilization, adequate spacing, and regular monitoring for early detection of any issues.',
      severity: 'low'
    }
  };
  
  // Convert disease name to lowercase for case-insensitive matching
  const lowerCaseName = diseaseName.toLowerCase();
  
  // Find the closest match
  for (const [key, value] of Object.entries(mockDiseases)) {
    if (key.includes(lowerCaseName) || lowerCaseName.includes(key)) {
      return value;
    }
  }
  
  // Default to generic advice if no match found
  return {
    name: diseaseName,
    scientificName: 'Unknown',
    description: 'We don\'t have specific information about this plant condition in our database.',
    symptoms: ['Symptoms may vary'],
    causes: 'Various factors could contribute to this condition.',
    treatment: 'Consult with a local plant expert or extension service for specific advice. In general, remove affected parts and improve plant care practices.',
    prevention: 'Maintain good plant health through proper watering, fertilization, and pest management.',
    severity: 'unknown'
  };
};

// Helper function to get mock diseases list
const getMockDiseasesList = () => {
  return [
    { name: 'Powdery Mildew', severity: 'medium' },
    { name: 'Leaf Spot', severity: 'medium' },
    { name: 'Rust', severity: 'medium' },
    { name: 'Blight', severity: 'high' },
    { name: 'Aphids', severity: 'medium' },
    { name: 'Spider Mites', severity: 'medium' },
    { name: 'Root Rot', severity: 'high' },
    { name: 'Downy Mildew', severity: 'medium' },
    { name: 'Bacterial Wilt', severity: 'high' },
    { name: 'Mosaic Virus', severity: 'high' }
  ];
};

module.exports = { getSolutionsByDisease, getAllDiseases };
