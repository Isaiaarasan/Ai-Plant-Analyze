import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HistoryPage.css';
import plantService from '../services/plantService';

const HistoryPage = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScan, setEditingScan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFormData, setEditFormData] = useState({
    disease: '',
    severity: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch history from API first if user is logged in
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Call the API to get scan history
          const apiHistory = await plantService.getScanHistory();
          setScanHistory(apiHistory);
          // Also update localStorage for offline access
          localStorage.setItem('scanHistory', JSON.stringify(apiHistory));
          setIsLoading(false);
          return;
        } catch (apiError) {
          console.error('API error, falling back to localStorage:', apiError);
          // Fall back to localStorage if API fails
        }
      }
      
      // If API call failed or user is not logged in, try localStorage
      const storedHistory = localStorage.getItem('scanHistory');
      
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      } else {
        // If nothing in localStorage, use mock data for demonstration
        const mockHistory = [
          {
            id: 1,
            date: new Date(2025, 3, 1),
            disease: 'Powdery Mildew',
            confidence: 92,
            severity: 'high',
            healthScore: 78,
            imageUrl: 'https://example.com/image1.jpg',
            treatment: 'Apply neem oil or a sulfur-based fungicide. Improve air circulation around plants.',
            prevention: 'Space plants properly. Avoid overhead watering. Remove infected leaves.'
          },
          {
            id: 2,
            date: new Date(2025, 3, 2),
            disease: 'Leaf Spot',
            confidence: 85,
            severity: 'medium',
            healthScore: 65,
            imageUrl: 'https://example.com/image2.jpg',
            treatment: 'Apply copper-based fungicide. Remove and destroy infected leaves.',
            prevention: 'Rotate crops. Avoid overhead watering. Keep garden clean of debris.'
          },
          {
            id: 3,
            date: new Date(2025, 3, 3),
            disease: 'Rust',
            confidence: 78,
            severity: 'medium',
            healthScore: 72,
            imageUrl: 'https://example.com/image3.jpg',
            treatment: 'Apply sulfur dust or spray. Remove heavily infected plants.',
            prevention: 'Increase spacing between plants. Avoid wetting leaves when watering.'
          },
          {
            id: 4,
            date: new Date(2025, 3, 4),
            disease: 'Healthy',
            confidence: 95,
            severity: 'low',
            healthScore: 95,
            imageUrl: 'https://example.com/image4.jpg',
            treatment: 'No treatment needed.',
            prevention: 'Continue with regular plant care practices.'
          }
        ];
        
        setScanHistory(mockHistory);
        localStorage.setItem('scanHistory', JSON.stringify(mockHistory));
      }
    } catch (err) {
      console.error('Error fetching scan history:', err);
      setError('Failed to load scan history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const openScanDetails = (scan) => {
    setSelectedScan(scan);
    setIsModalOpen(true);
  };

  const closeScanDetails = () => {
    setIsModalOpen(false);
  };

  const openEditModal = (scan) => {
    setEditingScan(scan);
    setEditFormData({
      disease: scan.disease || '',
      severity: scan.severity || 'medium',
      notes: scan.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingScan(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedScan = {
        ...editingScan,
        disease: editFormData.disease,
        severity: editFormData.severity,
        notes: editFormData.notes,
        lastUpdated: new Date()
      };
      
      if (token) {
        try {
          // Try to update via API first
          await plantService.updateScan(editingScan.id, {
            disease: editFormData.disease,
            severity: editFormData.severity,
            notes: editFormData.notes
          });
        } catch (apiError) {
          console.error('API error when updating scan:', apiError);
          // Continue with local update even if API fails
        }
      }
      
      // Update local storage and state
      const updatedHistory = scanHistory.map(scan => 
        scan.id === editingScan.id ? updatedScan : scan
      );
      
      setScanHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      
      // If the updated scan is currently selected, update it
      if (selectedScan && selectedScan.id === editingScan.id) {
        setSelectedScan(updatedScan);
      }
      
      closeEditModal();
    } catch (err) {
      console.error('Error updating scan:', err);
      alert('Failed to update scan. Please try again.');
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

  const deleteScan = async (scanId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Try to delete from API first
          await plantService.deleteScan(scanId);
        } catch (apiError) {
          console.error('API error when deleting scan:', apiError);
          // Continue with local deletion even if API fails
        }
      }
      
      // Update local storage and state
      const updatedHistory = scanHistory.filter(scan => scan.id !== scanId);
      setScanHistory(updatedHistory);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      
      // If the deleted scan is currently selected, close the modal
      if (selectedScan && selectedScan.id === scanId) {
        closeScanDetails();
      }
    } catch (err) {
      console.error('Error deleting scan:', err);
      alert('Failed to delete scan. Please try again.');
    }
  };

  return (
    <div className="history-page">
      <div className="container">
        <div className="history-header">
          <h1>Scan History</h1>
          <p>View your past plant scans and analysis results</p>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading scan history...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchScanHistory}>Try Again</button>
          </div>
        ) : scanHistory.length > 0 ? (
          <div className="history-grid">
            {scanHistory.map(scan => (
              <div key={scan.id} className="history-card" onClick={() => openEditModal(scan)}>
                <div className="history-card-image">
                  <img src={scan.imageUrl} alt={scan.disease} />
                </div>
                <div className="severity-badge-container">
                  <span className={`severity-badge ${getSeverityClass(scan.severity)}`}>
                    Severity: {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                  </span>
                </div>
                <div className="history-card-content">
                  <div className="history-card-header">
                    <h3>{scan.disease}</h3>
                    <span className="confidence">{scan.confidence}% confidence</span>
                  </div>
                  <p className="scan-date">{formatDate(scan.date)}</p>
                  {scan.notes && <p className="scan-notes">{scan.notes}</p>}
                  <div className="health-score-container">
                    <span>Health Score:</span>
                    <div className="health-score-bar">
                      <div 
                        className="health-score-progress" 
                        style={{ 
                          width: `${scan.healthScore}%`, 
                          backgroundColor: getHealthScoreColor(scan.healthScore) 
                        }}
                      ></div>
                    </div>
                    <span className="health-score-value">{scan.healthScore}</span>
                  </div>
                  <div className="card-actions">
                    <button className="btn btn-primary" onClick={(e) => {
                      e.stopPropagation();
                      openScanDetails(scan);
                    }}>
                      View Details
                    </button>
                    <button className="btn btn-edit" onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(scan);
                    }}>
                      Edit Scan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-history">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2>No scan history yet</h2>
            <p>Capture or upload an image to start analyzing plants</p>
            <Link to="/dashboard" className="btn btn-primary">Scan a Plant</Link>
          </div>
        )}

        {/* Scan Details Modal */}
        {isModalOpen && selectedScan && (
          <div className="modal-overlay" onClick={closeScanDetails}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

              <button className="modal-close" onClick={closeScanDetails}>
                &times;
              </button>
              
              <div className="modal-header">
                <h2>{selectedScan.disease}</h2>
                <span className={`severity-badge ${getSeverityClass(selectedScan.severity)}`}>
                  {selectedScan.severity.charAt(0).toUpperCase() + selectedScan.severity.slice(1)} Severity
                </span>
              </div>
              
              <div className="modal-body">
                <div className="modal-image">
                  <img src={selectedScan.imageUrl} alt={selectedScan.disease} />
                </div>
                
                <div className="scan-details">
                  <div className="scan-detail-item">
                    <h3>Scan Information</h3>
                    <p><strong>Date:</strong> {formatDate(selectedScan.date)}</p>
                    <p><strong>Confidence:</strong> {selectedScan.confidence}%</p>
                    <div className="health-score-container">
                      <strong>Health Score:</strong>
                      <div className="health-score-bar">
                        <div 
                          className="health-score-progress" 
                          style={{ 
                            width: `${selectedScan.healthScore}%`, 
                            backgroundColor: getHealthScoreColor(selectedScan.healthScore) 
                          }}
                        ></div>
                      </div>
                      <span className="health-score-value">{selectedScan.healthScore}</span>
                    </div>
                  </div>
                  
                  <div className="scan-detail-item">
                    <h3>Treatment</h3>
                    <p>{selectedScan.treatment}</p>
                  </div>
                  
                  <div className="scan-detail-item">
                    <h3>Prevention</h3>
                    <p>{selectedScan.prevention}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-outline btn-danger" onClick={() => deleteScan(selectedScan.id)}>Delete</button>
                <button className="btn btn-outline" onClick={closeScanDetails}>Close</button>
                {selectedScan.severity === 'high' && (
                  <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    Contact Expert
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Scan Modal */}
        {isEditModalOpen && editingScan && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closeEditModal}>
                &times;
              </button>
              <h2>Edit Scan Details</h2>
              
              <form onSubmit={handleEditSubmit} className="edit-scan-form">
                <div className="form-group">
                  <label htmlFor="disease">Disease Name</label>
                  <input 
                    type="text" 
                    id="disease" 
                    name="disease" 
                    value={editFormData.disease} 
                    onChange={handleEditFormChange} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="severity">Severity</label>
                  <select 
                    id="severity" 
                    name="severity" 
                    value={editFormData.severity} 
                    onChange={handleEditFormChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    value={editFormData.notes} 
                    onChange={handleEditFormChange} 
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
