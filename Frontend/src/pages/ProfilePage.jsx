import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';


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
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
          {updateMessage && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 border border-green-100 rounded-lg animate-fade-in">
              {updateMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-primary text-white text-4xl flex items-center justify-center font-bold mx-auto mb-4 shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-sm text-gray-500">Member since {formatDate(user.joinDate)}</p>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</h3>
                    <p className="text-gray-700">{user.email}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Location</h3>
                    <p className="text-gray-700">{user.location || 'Not specified'}</p>
                  </div>
                  <div className="py-3 border-b border-gray-100 last:border-0">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bio</h3>
                    <p className="text-gray-700">{user.bio || 'No bio yet'}</p>
                  </div>
                  <button
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleToggleEdit}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    ></textarea>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={handleToggleEdit}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
                    <p className="text-xs text-gray-500">Receive email alerts</p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${user.preferences?.notifications ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleTogglePreference('notifications')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.preferences?.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Dark Mode</h3>
                    <p className="text-xs text-gray-500">Use dark theme</p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${user.preferences?.darkMode ? 'bg-primary' : 'bg-gray-200'}`}
                    onClick={() => handleTogglePreference('darkMode')}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user.preferences?.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Language</h3>
                    <p className="text-xs text-gray-500">Preferred language</p>
                  </div>
                  <select
                    className="text-sm border-gray-300 bg-gray-50 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 p-1"
                    value={user.preferences?.language || 'English'}
                    onChange={async (e) => {
                      const newLanguage = e.target.value;
                      setUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: newLanguage }
                      }));
                      localStorage.setItem('language', newLanguage);
                      document.documentElement.setAttribute('lang', newLanguage.toLowerCase());
                      setUpdateMessage(`Language changed to ${newLanguage}`);
                      setTimeout(() => setUpdateMessage(''), 3000);
                      try {
                        await plantService.updateProfile({ preferences: { ...user.preferences, language: newLanguage } });
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

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Activity Overview</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold text-primary mb-1">{user.stats?.scans || 0}</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Scans</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold text-primary mb-1">{user.stats?.plants || 0}</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plants Tracked</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="block text-3xl font-bold text-primary mb-1">{user.stats?.badges || 0}</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Badges Earned</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-md hover:shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                  Start New Scan
                </Link>
                <Link to="/history" className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  View Scan History
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Account Security</h2>
              <div className="flex flex-col gap-4">
                <button className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full text-left cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Change Password</h4>
                      <p className="text-xs text-gray-500">Update your password to keep your account secure</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>

                <button className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors w-full text-left cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                        <line x1="18" y1="9" x2="12" y2="15"></line>
                        <line x1="12" y1="9" x2="18" y2="15"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700">Delete Account</h4>
                      <p className="text-xs text-red-500 text-opacity-80">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-300 group-hover:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
