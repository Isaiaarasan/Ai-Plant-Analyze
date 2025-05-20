import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';
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
      <div className="scan-container">
        {!captureMode && !capturedImage && !uploadedImage && (
          <div className="scan-options">
            <button className="btn btn-primary" onClick={startCamera}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Capture Image
            </button>
            <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="scan-preview">
          {isCapturing && (
            <div className="camera-container">
              <video 
                ref={videoRef} 
                className="camera-preview" 
                autoPlay 
                playsInline 
              />
              <button className="capture-button" onClick={captureImage}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="image-preview-container">
              <img src={capturedImage} alt="Captured plant" className="image-preview" />
              <div className="image-actions">
                <button className="btn btn-outline" onClick={resetCapture}>Retake</button>
                <button 
                  className="btn btn-primary" 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                </button>
              </div>
            </div>
          )}

          {uploadedImage && (
            <div className="image-preview-container">
              <img src={uploadedImage.url} alt="Uploaded plant" className="image-preview" />
              <div className="image-actions">
                <button className="btn btn-outline" onClick={resetCapture}>Choose Another</button>
                <button 
                  className="btn btn-primary" 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Plant'}
                </button>
              </div>
            </div>
          )}

          {!isCapturing && !capturedImage && !uploadedImage && (
            <div className="empty-preview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <h3>No Image Selected</h3>
              <p className="preview-subtitle">Capture or upload an image to analyze your plant</p>
            </div>
          )}
        </div>

        {analysisResult && (
          <div className="analysis-result">
            <div className="result-header">
              <h2>Analysis Results</h2>
              <div className="health-score-container">
                <div className="health-score">
                  <span className="health-score-value">{analysisResult.healthScore}</span>
                  <span className="health-score-label">Health</span>
                </div>
                <div className="health-score-bar">
                  <div 
                    className="health-score-progress" 
                    style={{ 
                      width: `${analysisResult.healthScore}%`, 
                      backgroundColor: getHealthScoreColor(analysisResult.healthScore) 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="result-details">
              <div className="result-item">
                <h3>Diagnosis</h3>
                <div className="disease-info">
                  <span className="disease-name">{analysisResult.disease}</span>
                  <span className="disease-confidence">{analysisResult.confidence}% confidence</span>
                  <span className={`disease-severity ${getSeverityClass(analysisResult.severity)}`}>
                    {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)} Severity
                  </span>
                </div>
              </div>

              <div className="result-item">
                <h3>Treatment</h3>
                <p>{analysisResult.treatment}</p>
              </div>

              <div className="result-item">
                <h3>Prevention</h3>
                <p>{analysisResult.prevention}</p>
              </div>

              <div className="expert-contact">
                {analysisResult.severity === 'high' && (
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <div className="history-container">
        <h2>Scan History</h2>
        
        {scanHistory.length > 0 ? (
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Date</th>
                  <th>Disease</th>
                  <th>Severity</th>
                  <th>Health Score</th>
                </tr>
              </thead>
              <tbody>
                {scanHistory.map(scan => (
                  <tr key={scan.id}>
                    <td>
                      <div className="history-image">
                        <img src={scan.imageUrl} alt={scan.disease} />
                      </div>
                    </td>
                    <td>{formatDate(scan.date)}</td>
                    <td>{scan.disease}</td>
                    <td>
                      <span className={`severity-badge ${getSeverityClass(scan.severity)}`}>
                        {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="health-score-mini">
                        <div 
                          className="health-score-mini-progress" 
                          style={{ 
                            width: `${scan.healthScore}%`, 
                            backgroundColor: getHealthScoreColor(scan.healthScore) 
                          }}
                        ></div>
                        <span>{scan.healthScore}</span>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-history">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>No scan history yet</h3>
            <p>Capture or upload an image to start analyzing plants</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h3>PlantAI</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item ${activeTab === 'scan' ? 'active' : ''}`} 
            onClick={() => setActiveTab('scan')}
          >
            <span className="sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </span>
            Scan Plant
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'history' ? 'active' : ''}`} 
            onClick={() => setActiveTab('history')}
          >
            <span className="sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
            History
          </button>
          <Link to="/profile" className="sidebar-nav-item">
            <span className="sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            Profile
          </Link>
          <Link to="/forum" className="sidebar-nav-item">
            <span className="sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </span>
            Community Forum
          </Link>
          <Link to="/Chatbox" className="sidebar-nav-item">
            <span className="sidebar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </span>
            Chatbox
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome to your Plant Dashboard</h1>
          <p>Scan your plants to detect diseases and get treatment recommendations</p>
        </div>

        <div className="dashboard-content">
          {activeTab === 'scan' ? renderScanTab() : renderHistoryTab()}
        </div>
      </main>

      <div>
        <h1>Dashboard</h1>
        <Chatbox />
      </div>
    </div>
  );
};

export default DashboardPage;
