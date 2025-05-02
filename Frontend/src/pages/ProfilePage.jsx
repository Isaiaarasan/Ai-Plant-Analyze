import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    bio: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUserData();
    
    // Apply dark mode if it's set in localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [navigate]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await plantService.getProfile();
      
      // Ensure userData has all required properties initialized
      const enhancedUserData = {
        ...userData,
        stats: userData.stats || { scans: 0, plants: 0, badges: 0 },
        preferences: userData.preferences || { notifications: false, darkMode: false, language: 'en' }
      };
      
      setUser(enhancedUserData);
      setFormData({
        username: enhancedUserData.username || '',
        email: enhancedUserData.email || '',
        location: enhancedUserData.location || '',
        bio: enhancedUserData.bio || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedUser = await plantService.updateProfile({
        username: formData.username,
        email: formData.email,
        location: formData.location,
        bio: formData.bio
      });
      
      setUser(updatedUser);
      setUpdateMessage('Profile updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePreference = async (preference) => {
    try {
      // Ensure preferences object exists
      const preferences = user.preferences || {};
      const newValue = !preferences[preference];
      
      // Update UI immediately for better user experience
      setUser(prev => ({
        ...prev,
        preferences: {
          ...(prev.preferences || {}),
          [preference]: newValue
        }
      }));
      
      // If toggling dark mode, apply it to the body
      if (preference === 'darkMode') {
        if (newValue) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'false');
        }
      }
      
      // Save to backend
      await plantService.updateProfile({
        preferences: {
          [preference]: newValue
        }
      });
    } catch (error) {
      console.error(`Error updating ${preference} preference:`, error);
      // Revert UI change if API call fails
      setUser(prev => {
        const prevPreferences = prev.preferences || {};
        return {
          ...prev,
          preferences: {
            ...prevPreferences,
            [preference]: !prevPreferences[preference]
          }
        };
      });
    }
  };

  if (isLoading && !user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">
            <h2>Error loading profile</h2>
            <p>Unable to load your profile information. Please try again later.</p>
            <button className="btn btn-primary" onClick={fetchUserData}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    // Check if date is valid
    if (!date) return 'Unknown date';
    
    try {
      // If date is a string, convert it to a Date object
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account and preferences</p>
          {updateMessage && (
            <div className="update-message">{updateMessage}</div>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-main">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{user.username}</h2>
                  <p>Member since {formatDate(user.joinDate)}</p>
                </div>
                {!isEditing && (
                  <button className="btn btn-outline" onClick={handleToggleEdit}>
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form className="profile-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn btn-outline" onClick={handleToggleEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <h3>Email</h3>
                    <p>{user.email}</p>
                  </div>
                  <div className="profile-detail-item">
                    <h3>Location</h3>
                    <p>{user.location}</p>
                  </div>
                  <div className="profile-detail-item">
                    <h3>Bio</h3>
                    <p>{user.bio}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-card">
              <h2 className="profile-card-title">Activity Overview</h2>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{user.stats?.scans || 0}</span>
                  <span className="stat-label">Total Scans</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.stats?.plants || 0}</span>
                  <span className="stat-label">Plants Tracked</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user.stats?.badges || 0}</span>
                  <span className="stat-label">Badges Earned</span>
                </div>
              </div>
              <div className="profile-actions">
                <Link to="/history" className="btn btn-outline">
                  View Scan History
                </Link>
                <Link to="/dashboard" className="btn btn-primary">
                  New Scan
                </Link>
              </div>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="profile-card">
              <h2 className="profile-card-title">Preferences</h2>
              <div className="preferences-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Notifications</h3>
                    <p>Receive email notifications about scan results and tips</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={user.preferences?.notifications || false} 
                      onChange={() => handleTogglePreference('notifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Dark Mode</h3>
                    <p>Switch between light and dark theme</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={user.preferences?.darkMode || false} 
                      onChange={() => handleTogglePreference('darkMode')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference-item">
                  <div className="preference-info">
                    <h3>Language</h3>
                    <p>Choose your preferred language</p>
                  </div>
                  <select 
                    className="language-select"
                    value={user.preferences?.language || 'English'}
                    onChange={async (e) => {
                      const newLanguage = e.target.value;
                      
                      // Update UI immediately
                      setUser(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          language: newLanguage
                        }
                      }));
                      
                      // Apply language change
                      localStorage.setItem('language', newLanguage);
                      document.documentElement.setAttribute('lang', newLanguage.toLowerCase());
                      
                      // Update HTML lang attribute
                      document.querySelector('html').setAttribute('lang', newLanguage.toLowerCase());
                      
                      // Show feedback to user with more visible notification
                      setUpdateMessage(`Language changed to ${newLanguage}`);
                      
                      // Create a visible notification
                      const notification = document.createElement('div');
                      notification.className = 'language-notification';
                      notification.textContent = `Language changed to ${newLanguage}`;
                      document.body.appendChild(notification);
                      
                      // Remove notification after 3 seconds
                      setTimeout(() => {
                        notification.classList.add('fade-out');
                        setTimeout(() => {
                          document.body.removeChild(notification);
                          setUpdateMessage('');
                        }, 500);
                      }, 3000);
                      
                      // Save to backend
                      try {
                        await plantService.updateProfile({
                          preferences: {
                            ...user.preferences,
                            language: newLanguage
                          }
                        });
                        
                        // Force reload to apply language changes throughout the app
                        window.location.reload();
                      } catch (error) {
                        console.error('Error updating language preference:', error);
                      }
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
