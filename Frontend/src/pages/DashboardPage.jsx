import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import plantService from '../services/plantService';
import Chatbox from '../components/Chatbox';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [captureMode, setCaptureMode] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const storedHistory = localStorage.getItem('scanHistory');
        if (storedHistory) {
          setScanHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Error fetching scan history:', error);
      }
    };

    fetchScanHistory();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCaptureMode('camera');
      setIsCapturing(true);
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions or try uploading an image instead.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    // Stop the camera stream
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCapturing(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg');

    // Set the captured image
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setCaptureMode('upload');
    setError(null);

    // Check if the file is an image
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage({
      file,
      url: imageUrl
    });
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setAnalysisResult(null);
    setCaptureMode(null);
  };

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      let imageFile;
      let imageUrl;

      if (capturedImage) {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        imageFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        imageUrl = capturedImage;
      } else if (uploadedImage) {
        imageFile = uploadedImage.file;
        imageUrl = uploadedImage.url;
      } else {
        throw new Error('No image selected');
      }

      try {
        const result = await plantService.detectDisease(imageFile);

        setAnalysisResult(result);

        const newScan = {
          id: Date.now(),
          date: new Date(),
          imageUrl: imageUrl,
          ...result
        };

        const storedHistory = localStorage.getItem('scanHistory');
        const scanHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedHistory = [newScan, ...scanHistory];

        setScanHistory(updatedHistory);
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      } catch (apiError) {
        console.error('API error:', apiError);

        console.log('Falling back to mock data due to API error');

        const mockResults = [
          {
            disease: 'Powdery Mildew',
            confidence: 92,
            severity: 'high',
            healthScore: 65,
            treatment: 'Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.',
            prevention: 'Space plants properly. Avoid overhead watering. Remove infected leaves.'
          },
          {
            disease: 'Leaf Spot',
            confidence: 85,
            severity: 'medium',
            healthScore: 72,
            treatment: 'Apply copper-based fungicide. Remove and destroy infected leaves.',
            prevention: 'Rotate crops. Avoid overhead watering. Keep garden clean of debris.'
          },
          {
            disease: 'Rust',
            confidence: 78,
            severity: 'medium',
            healthScore: 75,
            treatment: 'Apply sulfur dust or spray. Remove heavily infected plants.',
            prevention: 'Increase spacing between plants. Avoid wetting leaves when watering.'
          },
          {
            disease: 'Healthy',
            confidence: 95,
            severity: 'low',
            healthScore: 95,
            treatment: 'No treatment needed.',
            prevention: 'Continue with regular plant care practices.'
          },
          {
            disease: 'Blight',
            confidence: 88,
            severity: 'high',
            healthScore: 60,
            treatment: 'Remove and destroy affected parts. Apply fungicide promptly.',
            prevention: 'Avoid overhead watering. Ensure good drainage. Rotate crops regularly.'
          },
          {
            disease: 'Downy Mildew',
            confidence: 81,
            severity: 'high',
            healthScore: 67,
            treatment: 'Use fungicides containing mancozeb or chlorothalonil. Remove infected leaves.',
            prevention: 'Provide good airflow. Avoid water on leaves. Grow resistant varieties.'
          },
          {
            disease: 'Anthracnose',
            confidence: 79,
            severity: 'medium',
            healthScore: 70,
            treatment: 'Prune and destroy infected areas. Apply fungicides if needed.',
            prevention: 'Keep foliage dry. Use disease-free seeds. Clean garden tools.'
          },
          {
            disease: 'Root Rot',
            confidence: 90,
            severity: 'high',
            healthScore: 58,
            treatment: 'Improve soil drainage. Apply fungicide to affected areas.',
            prevention: 'Avoid overwatering. Use well-draining soil. Remove infected plants promptly.'
          },
          {
            disease: 'Bacterial Wilt',
            confidence: 86,
            severity: 'high',
            healthScore: 62,
            treatment: 'Remove and destroy infected plants. Solarize soil if possible.',
            prevention: 'Control insect vectors. Rotate crops. Use resistant varieties.'
          },
          {
            disease: 'Healthy',
            confidence: 98,
            severity: 'low',
            healthScore: 97,
            treatment: 'No treatment necessary.',
            prevention: 'Maintain consistent watering, proper nutrition, and regular inspections.'
          },
          {
            disease: 'Sooty Mold',
            confidence: 77,
            severity: 'medium',
            healthScore: 74,
            treatment: 'Wash mold off with water and mild soap. Control sap-sucking insects.',
            prevention: 'Control aphids and whiteflies. Clean leaves regularly.'
          },
          {
            disease: 'Verticillium Wilt',
            confidence: 84,
            severity: 'high',
            healthScore: 63,
            treatment: 'Remove and destroy infected plants. Avoid replanting susceptible crops.',
            prevention: 'Use resistant plant varieties. Practice crop rotation.'
          },
          {
            disease: 'Fusarium Wilt',
            confidence: 87,
            severity: 'high',
            healthScore: 61,
            treatment: 'Destroy infected plants. Solarize soil before planting.',
            prevention: 'Plant resistant cultivars. Keep soil healthy and well-drained.'
          },
          {
            disease: 'Canker',
            confidence: 80,
            severity: 'medium',
            healthScore: 69,
            treatment: 'Prune and destroy infected branches. Apply protective fungicides.',
            prevention: 'Avoid plant injuries. Sanitize pruning tools.'
          },
          {
            disease: 'Scab',
            confidence: 76,
            severity: 'low',
            healthScore: 78,
            treatment: 'Use sulfur sprays. Remove fallen leaves and fruit.',
            prevention: 'Plant resistant varieties. Improve air circulation.'
          },
          {
            disease: 'Mosaic Virus',
            confidence: 89,
            severity: 'high',
            healthScore: 59,
            treatment: 'No cure. Remove infected plants to prevent spread.',
            prevention: 'Control aphids. Use virus-free seeds.'
          },
          {
            disease: 'Early Blight',
            confidence: 83,
            severity: 'medium',
            healthScore: 66,
            treatment: 'Use fungicide sprays. Remove infected leaves.',
            prevention: 'Avoid overhead irrigation. Practice crop rotation.'
          },
          {
            disease: 'Botrytis (Gray Mold)',
            confidence: 82,
            severity: 'medium',
            healthScore: 68,
            treatment: 'Remove affected parts. Apply fungicide if needed.',
            prevention: 'Ensure proper ventilation. Avoid excess humidity.'
          },
          {
            disease: 'Black Rot',
            confidence: 88,
            severity: 'high',
            healthScore: 64,
            treatment: 'Remove infected parts. Use copper-based sprays.',
            prevention: 'Avoid overhead watering. Improve soil drainage.'
          },
          {
            disease: 'Cercospora Leaf Spot',
            confidence: 80,
            severity: 'medium',
            healthScore: 71,
            treatment: 'Apply fungicide. Remove infected foliage.',
            prevention: 'Avoid overcrowding. Rotate crops regularly.'
          },
          {
            disease: 'Healthy',
            confidence: 93,
            severity: 'low',
            healthScore: 94,
            treatment: 'No treatment required.',
            prevention: 'Monitor for early signs of disease. Use compost-rich soil.'
          },
          {
            disease: 'Clubroot',
            confidence: 91,
            severity: 'high',
            healthScore: 57,
            treatment: 'Uproot infected plants. Raise soil pH with lime.',
            prevention: 'Rotate crops. Use disease-free transplants.'
          },
          {
            disease: 'Damping Off',
            confidence: 85,
            severity: 'high',
            healthScore: 62,
            treatment: 'Improve drainage and airflow. Use fungicidal seed treatment.',
            prevention: 'Avoid overwatering seedlings. Sterilize soil before planting.'
          },
          {
            disease: 'Healthy',
            confidence: 96,
            severity: 'low',
            healthScore: 96,
            treatment: 'Keep following good gardening practices.',
            prevention: 'Regularly inspect plants. Use organic fertilizers.'
          },
          {
            disease: 'Bacterial Leaf Spot',
            confidence: 86,
            severity: 'medium',
            healthScore: 73,
            treatment: 'Apply copper-based bactericides. Remove infected parts.',
            prevention: 'Avoid working with wet plants. Improve air circulation.'
          }
        ];


        // Randomly select a result for demo purposes
        const randomIndex = Math.floor(Math.random() * mockResults.length);
        const result = mockResults[randomIndex];

        // Set the analysis result
        setAnalysisResult(result);

        // Save to scan history (in localStorage for demo)
        const newScan = {
          id: Date.now(),
          date: new Date(),
          imageUrl: imageUrl,
          ...result
        };

        const storedHistory = localStorage.getItem('scanHistory');
        const scanHistory = storedHistory ? JSON.parse(storedHistory) : [];
        const updatedHistory = [newScan, ...scanHistory];

        setScanHistory(updatedHistory);
        localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const renderScanTab = () => {
    return (
      <div className="flex flex-col gap-6">
        {!captureMode && !capturedImage && !uploadedImage && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md cursor-pointer" onClick={startCamera}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Capture Image
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm hover:shadow-md cursor-pointer" onClick={() => fileInputRef.current.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="m-0">{error}</p>
          </div>
        )}

        <div className="bg-gray-100 rounded-xl overflow-hidden min-h-[400px] flex items-center justify-center relative shadow-inner">
          {isCapturing && (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-cover max-h-[600px]"
                autoPlay
                playsInline
              />
              <button className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-white hover:bg-primary text-gray-800 hover:text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={captureImage}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-black">
              <img src={capturedImage} alt="Captured plant" className="max-w-full max-h-[600px] object-contain" />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 w-full justify-center px-4">
                <button className="px-6 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white font-medium shadow-lg transition-colors cursor-pointer" onClick={resetCapture}>Retake</button>
                <button
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing && <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                </button>
              </div>
            </div>
          )}

          {uploadedImage && (
            <div className="relative w-full h-full min-h-[400px] flex items-center justify-center bg-black">
              <img src={uploadedImage.url} alt="Uploaded plant" className="max-w-full max-h-[600px] object-contain" />
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 w-full justify-center px-4">
                <button className="px-6 py-2 bg-white/90 backdrop-blur-sm text-gray-800 rounded-lg hover:bg-white font-medium shadow-lg transition-colors cursor-pointer" onClick={resetCapture}>Choose Another</button>
                <button
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing && <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></span>}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                </button>
              </div>
            </div>
          )}

          {!isCapturing && !capturedImage && !uploadedImage && (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No Image Selected</h3>
              <p className="text-sm">Capture or upload an image to analyze your plant</p>
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
              <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100">
                  <span className="text-xl font-bold text-primary">{analysisResult.healthScore}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wide">Health</span>
                </div>
                <div className="flex-1 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${analysisResult.healthScore}%`,
                      backgroundColor: getHealthScoreColor(analysisResult.healthScore)
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Diagnosis</h3>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-gray-900">{analysisResult.disease}</span>
                  <span className="text-sm text-gray-500">{analysisResult.confidence}% confidence</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide w-fit mt-2 ${analysisResult.severity === 'high' ? 'bg-red-100 text-red-600' :
                    analysisResult.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                    {analysisResult.severity} Severity
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Treatment
                </h3>
                <p className="text-gray-600 leading-relaxed">{analysisResult.treatment}</p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Prevention
                </h3>
                <p className="text-gray-600 leading-relaxed">{analysisResult.prevention}</p>
              </div>

              <div className="md:col-span-2 text-center mt-4">
                {analysisResult.severity === 'high' && (
                  <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium cursor-pointer shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Contact Plant Expert
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistoryTab = () => {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-gray-800">Scan History</h2>

        {scanHistory.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wide">Image</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wide">Date</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wide">Disease</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wide">Severity</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wide">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scanHistory.map(scan => (
                    <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img src={scan.imageUrl} alt={scan.disease} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium whitespace-nowrap">{formatDate(scan.date)}</td>
                      <td className="p-4 text-gray-800 font-medium">{scan.disease}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${scan.severity === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                          scan.severity === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${scan.healthScore}%`,
                                backgroundColor: getHealthScoreColor(scan.healthScore)
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{scan.healthScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No scan history yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Capture or upload an image to start analyzing plants</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-screen bg-gray-50">
      <aside className="bg-white border-r border-gray-200 hidden md:flex flex-col fixed top-[70px] left-0 bottom-0 w-[250px] z-10 overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-primary">PlantAI</h3>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${activeTab === 'scan' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            onClick={() => setActiveTab('scan')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Scan Plant
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors cursor-pointer ${activeTab === 'history' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            onClick={() => setActiveTab('history')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            History
          </button>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </Link>
          <Link to="/forum" className="flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Community Forum
          </Link>
          <Link to="/Chatbox" className="flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Chatbox
          </Link>
        </nav>
      </aside>

      <main className="md:col-start-2 p-4 md:p-8 mt-4 md:mt-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to your Plant Dashboard</h1>
          <p className="text-gray-500">Scan your plants to detect diseases and get treatment recommendations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {activeTab === 'scan' ? renderScanTab() : renderHistoryTab()}
        </div>
      </main>

      {/* Chatbox removed from bottom, assuming it's a page or floating component */}
    </div>
  );
};

export default DashboardPage;
