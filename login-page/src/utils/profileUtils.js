// Profile management utility functions

// Save user profile to localStorage
export const saveUserProfile = (userData) => {
  localStorage.setItem('user_profile', JSON.stringify(userData));
  return true;
};

// Get user profile from localStorage
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  return !!getUserProfile();
};

// Log user out
export const logoutUser = () => {
  localStorage.removeItem('user_profile');
  return true;
};

// Update user profile
export const updateUserProfile = (updates) => {
  const currentProfile = getUserProfile();
  if (!currentProfile) return false;
  
  const updatedProfile = {
    ...currentProfile,
    ...updates
  };
  
  return saveUserProfile(updatedProfile);
}; 