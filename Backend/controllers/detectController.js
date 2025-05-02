const Scan = require('../models/Scan');
const Disease = require('../models/Disease');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Helper function to identify plant disease using image features
const identifyDisease = async (imagePath) => {
  try {
    // In a production environment, you would use a real ML model or API
    // For demonstration, we'll use a simulated analysis based on image features
    // like color distribution, texture patterns, etc.
    
    // 1. Analyze common plant diseases based on visual features
    const diseases = await Disease.find().select('name symptoms severity treatment prevention');
    
    if (diseases.length === 0) {
      // If no diseases in database, seed with some common ones
      await seedDiseases();
      return {
        disease: 'Powdery Mildew',
        confidence: 85,
        severity: 'medium',
        healthScore: 72,
        treatment: 'Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.',
        prevention: 'Space plants properly. Avoid overhead watering. Remove infected leaves.'
      };
    }
    
    // 2. For demonstration, randomly select a disease with weighted probability
    // In a real implementation, this would be the result of image analysis
    const randomIndex = Math.floor(Math.random() * diseases.length);
    const detectedDisease = diseases[randomIndex];
    
    // 3. Generate a confidence score and health score
    const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
    const healthScore = detectedDisease.severity === 'high' ? 
      Math.floor(Math.random() * 20) + 50 : // 50-69 for high severity
      detectedDisease.severity === 'medium' ? 
        Math.floor(Math.random() * 20) + 70 : // 70-89 for medium severity
        Math.floor(Math.random() * 10) + 90; // 90-99 for low severity
    
    return {
      disease: detectedDisease.name,
      confidence,
      severity: detectedDisease.severity,
      healthScore,
      treatment: detectedDisease.treatment,
      prevention: detectedDisease.prevention
    };
  } catch (error) {
    console.error('Error in disease identification:', error);
    throw new Error('Failed to analyze plant image');
  }
};

// Seed the database with common plant diseases if empty
const seedDiseases = async () => {
  const commonDiseases = [
    {
      name: 'Powdery Mildew',
      description: 'A fungal disease that affects a wide range of plants, characterized by white powdery spots on leaves and stems.',
      symptoms: ['White powdery spots on leaves', 'Yellowing leaves', 'Distorted growth', 'Premature leaf drop'],
      causes: 'Caused by various species of fungi in the Erysiphales order, thriving in humid conditions with poor air circulation.',
      treatment: 'Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.',
      prevention: 'Space plants properly. Avoid overhead watering. Remove infected leaves.',
      plantTypes: ['Roses', 'Cucumbers', 'Squash', 'Pumpkins', 'Melons', 'Grapes'],
      severity: 'medium',
      imageUrl: 'https://example.com/powdery-mildew.jpg'
    },
    {
      name: 'Leaf Spot',
      description: 'A common plant disease characterized by brown or black spots on leaves, caused by various fungi and bacteria.',
      symptoms: ['Brown or black spots on leaves', 'Yellowing around spots', 'Spots may have a yellow halo', 'Leaf drop'],
      causes: 'Caused by various fungi and bacteria, often spread by water splash and favored by wet conditions.',
      treatment: 'Apply copper-based fungicide. Remove and destroy infected leaves.',
      prevention: 'Rotate crops. Avoid overhead watering. Keep garden clean of debris.',
      plantTypes: ['Tomatoes', 'Peppers', 'Strawberries', 'Roses', 'Maple trees'],
      severity: 'medium',
      imageUrl: 'https://example.com/leaf-spot.jpg'
    },
    {
      name: 'Rust',
      description: 'A fungal disease that produces rusty-colored spots on leaves and stems, weakening the plant.',
      symptoms: ['Orange or rusty-colored pustules on leaves', 'Yellow spots on upper leaf surface', 'Distorted growth', 'Premature leaf drop'],
      causes: 'Caused by various rust fungi, often spread by wind and favored by humid conditions.',
      treatment: 'Apply sulfur dust or spray. Remove heavily infected plants.',
      prevention: 'Increase spacing between plants. Avoid wetting leaves when watering.',
      plantTypes: ['Beans', 'Roses', 'Snapdragons', 'Hollyhocks', 'Daylilies'],
      severity: 'medium',
      imageUrl: 'https://example.com/rust.jpg'
    },
    {
      name: 'Blight',
      description: 'A serious plant disease that causes rapid browning and death of plant tissues, often affecting entire plants.',
      symptoms: ['Brown spots that spread rapidly', 'Wilting', 'Blackened stems', 'Plant collapse'],
      causes: 'Caused by various fungi and bacteria, often thriving in warm, wet conditions.',
      treatment: 'Apply copper-based fungicide. Remove infected parts.',
      prevention: 'Rotate crops. Avoid overhead watering. Use disease-resistant varieties.',
      plantTypes: ['Tomatoes', 'Potatoes', 'Peppers', 'Eggplants'],
      severity: 'high',
      imageUrl: 'https://example.com/blight.jpg'
    },
    {
      name: 'Aphid Infestation',
      description: 'Small sap-sucking insects that cluster on new growth and the undersides of leaves, causing distortion and weakening.',
      symptoms: ['Clusters of small insects on stems and leaves', 'Curled or distorted leaves', 'Sticky honeydew on leaves', 'Sooty mold growth'],
      causes: 'Aphids reproduce rapidly in warm weather and are attracted to plants with soft new growth.',
      treatment: 'Spray with insecticidal soap or neem oil. Introduce beneficial insects like ladybugs.',
      prevention: 'Monitor plants regularly. Avoid excessive nitrogen fertilizer. Encourage beneficial insects.',
      plantTypes: ['Roses', 'Vegetables', 'Fruit trees', 'Ornamentals'],
      severity: 'medium',
      imageUrl: 'https://example.com/aphids.jpg'
    },
    {
      name: 'Healthy Plant',
      description: 'No disease detected. The plant appears to be healthy.',
      symptoms: ['Vibrant color', 'Normal growth pattern', 'No visible spots or discoloration', 'Healthy leaf structure'],
      causes: 'Proper care including adequate water, light, and nutrients.',
      treatment: 'Continue regular plant care practices.',
      prevention: 'Maintain regular watering, appropriate light conditions, and periodic fertilization.',
      plantTypes: ['All plants'],
      severity: 'low',
      imageUrl: 'https://example.com/healthy-plant.jpg'
    }
  ];
  
  try {
    await Disease.insertMany(commonDiseases);
    console.log('Database seeded with common plant diseases');
  } catch (error) {
    console.error('Error seeding diseases:', error);
  }
};

// Upload and analyze plant image
exports.detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Get the uploaded file path
    const imagePath = req.file.path;
    
    // Identify the disease
    const result = await identifyDisease(imagePath);
    
    // Create a new scan record
    const userId = req.user ? req.user.id : null;
    const newScan = new Scan({
      user: userId,
      imageUrl: `/uploads/${req.file.filename}`,
      result: {
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        healthScore: result.healthScore,
        treatment: result.treatment,
        prevention: result.prevention
      },
      date: new Date()
    });
    
    await newScan.save();
    
    res.status(200).json({
      id: newScan._id,
      date: newScan.date,
      imageUrl: newScan.imageUrl,
      ...result
    });
  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({ message: 'Error detecting plant disease', error: error.message });
  }
};

// Get scan history for a user
exports.getScanHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const scans = await Scan.find({ user: userId }).sort({ date: -1 });
    
    res.status(200).json(scans.map(scan => ({
      id: scan._id,
      date: scan.date,
      imageUrl: scan.imageUrl,
      disease: scan.result.disease,
      confidence: scan.result.confidence,
      severity: scan.result.severity,
      healthScore: scan.result.healthScore,
      treatment: scan.result.treatment,
      prevention: scan.result.prevention
    })));
  } catch (error) {
    console.error('Error fetching scan history:', error);
    res.status(500).json({ message: 'Error fetching scan history', error: error.message });
  }
};

// Get a specific scan by ID
exports.getScanById = async (req, res) => {
  try {
    const scanId = req.params.id;
    const scan = await Scan.findById(scanId);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Check if the scan belongs to the requesting user
    if (scan.user && scan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this scan' });
    }
    
    res.status(200).json({
      id: scan._id,
      date: scan.date,
      imageUrl: scan.imageUrl,
      disease: scan.result.disease,
      confidence: scan.result.confidence,
      severity: scan.result.severity,
      healthScore: scan.result.healthScore,
      treatment: scan.result.treatment,
      prevention: scan.result.prevention
    });
  } catch (error) {
    console.error('Error fetching scan:', error);
    res.status(500).json({ message: 'Error fetching scan details', error: error.message });
  }
};

// Delete a scan
exports.deleteScan = async (req, res) => {
  try {
    const scanId = req.params.id;
    const scan = await Scan.findById(scanId);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Check if the scan belongs to the requesting user
    if (scan.user && scan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to delete this scan' });
    }
    
    // Delete the image file if it exists
    if (scan.imageUrl) {
      const imagePath = path.join(__dirname, '..', 'public', scan.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Scan.findByIdAndDelete(scanId);
    
    res.status(200).json({ message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({ message: 'Error deleting scan', error: error.message });
  }
};
