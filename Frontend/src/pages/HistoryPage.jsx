import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scan History</h1>
          <p className="text-gray-500">View your past plant scans and analysis results</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
            <p>Loading scan history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer" onClick={fetchScanHistory}>Try Again</button>
          </div>
        ) : scanHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {scanHistory.map(scan => (
              <div key={scan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full" onClick={() => openEditModal(scan)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={scan.imageUrl} alt={scan.disease} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(scan);
                      }}
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm ${scan.severity === 'high' ? 'bg-red-500/90 text-white' :
                      scan.severity === 'medium' ? 'bg-orange-500/90 text-white' :
                        'bg-green-500/90 text-white'
                      }`}>
                      {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)} Severity
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{scan.disease}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">{scan.confidence}% conf.</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">{formatDate(scan.date)}</p>

                  {scan.notes && <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded mb-4 line-clamp-2">{scan.notes}</p>}

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Health Score</span>
                      <span className="font-semibold text-gray-700">{scan.healthScore}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${scan.healthScore}%`,
                          backgroundColor: getHealthScoreColor(scan.healthScore)
                        }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button className="px-3 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm font-medium cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        openScanDetails(scan);
                      }}>
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(scan);
                      }}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No scan history yet</h2>
            <p className="text-gray-500 mb-6">Capture or upload an image to start analyzing plants</p>
            <Link to="/dashboard" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium cursor-pointer shadow-sm">Scan a Plant</Link>
          </div>
        )}

        {/* Scan Details Modal */}
        {isModalOpen && selectedScan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeScanDetails}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    {selectedScan.disease}
                    <span className={`text-sm px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${selectedScan.severity === 'high' ? 'bg-red-100 text-red-600' :
                      selectedScan.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                      {selectedScan.severity} Severity
                    </span>
                  </h2>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer" onClick={closeScanDetails}>
                  <span className="text-2xl leading-none">&times;</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img src={selectedScan.imageUrl} alt={selectedScan.disease} className="w-full h-auto max-h-[400px] object-contain bg-black" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Scan Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date</span>
                          <span className="font-medium text-gray-800">{formatDate(selectedScan.date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confidence</span>
                          <span className="font-medium text-gray-800">{selectedScan.confidence}%</span>
                        </div>
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Health Score</span>
                            <span className="font-bold text-primary">{selectedScan.healthScore}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${selectedScan.healthScore}%`,
                                backgroundColor: getHealthScoreColor(selectedScan.healthScore)
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Treatment
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedScan.treatment}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Prevention
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedScan.prevention}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center">
                <button
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm cursor-pointer"
                  onClick={() => deleteScan(selectedScan.id)}
                >
                  Delete Record
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer" onClick={closeScanDetails}>Close</button>
                  {selectedScan.severity === 'high' && (
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium cursor-pointer shadow-sm flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Contact Expert
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Scan Modal */}
        {isEditModalOpen && editingScan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={closeEditModal}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Edit Scan Details</h2>
                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer" onClick={closeEditModal}>
                  <span className="text-2xl leading-none">&times;</span>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="disease" className="block text-sm font-medium text-gray-700 mb-1">Disease Name</label>
                    <input
                      type="text"
                      id="disease"
                      name="disease"
                      value={editFormData.disease}
                      onChange={handleEditFormChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      id="severity"
                      name="severity"
                      value={editFormData.severity}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={editFormData.notes}
                      onChange={handleEditFormChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer" onClick={closeEditModal}>
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
