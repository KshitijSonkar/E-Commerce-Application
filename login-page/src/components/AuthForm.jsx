import React, { useState, useEffect } from 'react';
import ProfileSetup from './ProfileSetup';
import { saveUserProfile, getUserProfile } from '../utils/profileUtils';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: ''
  });
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [bypassInitialLogin, setBypassInitialLogin] = useState(false);
  
  // Check if user is already logged in, but only if not coming from profile setup
  useEffect(() => {
    // Skip automatic login if coming from profile setup
    if (bypassInitialLogin) {
      setBypassInitialLogin(false);
      return;
    }
    
    // Check for previously stored session from localStorage
    const profile = getUserProfile();
    if (profile) {
      // Get URL parameters to check for explicit login request
      const urlParams = new URLSearchParams(window.location.search);
      const requireLogin = urlParams.get('login') === 'true';
      
      // Check if we need explicit login (after profile setup)
      const needsExplicitLogin = localStorage.getItem('requireExplicitLogin') === 'true';
      
      // Only auto-login if this isn't the initial page load or if explicitly requested
      const isInitialLoad = sessionStorage.getItem('visitedBefore') !== 'true';
      // Check if session is authenticated
      const isAuthenticated = sessionStorage.getItem('authenticatedSession') === 'true';
      
      if ((isAuthenticated && !needsExplicitLogin) || requireLogin) {
        setUserProfile(profile);
        setLoggedIn(true);
        // Auto-redirect to home if user is already logged in and not on initial load
        setRedirectToHome(true);
      } else {
        // For first visit or after profile setup, just show the login form
        if (needsExplicitLogin) {
          // Pre-fill email if we have it
          setFormData(prev => ({
            ...prev,
            email: profile.email || ''
          }));
        }
        
        // If we're coming from profile setup, don't clear the saved profile
        if (!needsExplicitLogin && isInitialLoad) {
          // For regular first visit, clear any saved profile from localStorage
          localStorage.removeItem('user_profile');
        }
      }
      
      // Mark that the user has visited before
      sessionStorage.setItem('visitedBefore', 'true');
    }
  }, [bypassInitialLogin]);

  // Handle redirection to homepage
  if (redirectToHome) {
    return (
      <div className="redirect-message">
        <h2>Login Successful!</h2>
        <p>Redirecting to home page...</p>
        <div className="loading-spinner"></div>
        <p className="note">Note: Home page will be implemented soon.</p>
      </div>
    );
  }
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // Before showing profile setup, set the bypass flag
  const handleSignupSubmit = () => {
    setBypassInitialLogin(true);
    setUserData({
      ...formData
    });
    setShowProfileSetup(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (!isLogin) {
      // For registration, proceed to profile setup
      handleSignupSubmit();
    } else {
      // For login, simulate authentication
      console.log('Login submitted', { 
        ...formData
      });
      
      // Validate credentials against stored profile
      const storedProfile = getUserProfile();
      
      // In a real app, you'd validate against server, but for now just check email
      if (storedProfile && storedProfile.email === formData.email) {
        // Use the stored profile data
        setUserProfile(storedProfile);
        // Ensure session is marked as authenticated for future visits
        sessionStorage.setItem('visitedBefore', 'true');
        sessionStorage.setItem('authenticatedSession', 'true');
        // Remove the requirement for explicit login
        localStorage.removeItem('requireExplicitLogin');
        setLoggedIn(true);
        // Redirect to home page
        setRedirectToHome(true);
      } else {
        // Use mock data if no matching profile found
        const mockUser = {
          id: '12345',
          email: formData.email,
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'HeroUser',
          avatar: {
            id: 1,
            name: 'Superman',
            color: '#0066ff',
            symbol: 'S',
            image: '/assets/avatars/superman.png'
          }
        };
        
        saveUserProfile(mockUser);
        setUserProfile(mockUser);
        // Mark this as an authenticated session
        sessionStorage.setItem('visitedBefore', 'true');
        sessionStorage.setItem('authenticatedSession', 'true');
        // Remove the requirement for explicit login
        localStorage.removeItem('requireExplicitLogin');
        setLoggedIn(true);
        // Redirect to home page
        setRedirectToHome(true);
      }
    }
  };

  const handleGoogleLogin = () => {
    console.log('Login with Google clicked');
    // Here you would typically implement Google OAuth authentication
  };

  const handleProfileComplete = (profileData) => {
    console.log('Profile setup completed', profileData);
    
    // Save the profile data but don't log in
    saveUserProfile(profileData);
    
    // Reset form and show login page instead of profile
    setFormData({
      email: profileData.email || '', // Pre-fill email if available
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      username: ''
    });
    
    // Explicitly clear any auto-login flags
    sessionStorage.removeItem('authenticatedSession');
    localStorage.setItem('requireExplicitLogin', 'true');
    
    // Reset state to show login form
    setShowProfileSetup(false);
    setLoggedIn(false);
    setUserProfile(null); // Clear any user profile data
    setIsLogin(true); // Show login form
    
    // Show success message
    setTimeout(() => {
      alert('Profile created successfully! Please sign in with your credentials to continue to the home page.');
    }, 100);
  };

  const handleLogout = () => {
    // Clear profile from localStorage
    localStorage.removeItem('user_profile');
    // Clear session flags
    sessionStorage.removeItem('authenticatedSession');
    localStorage.removeItem('requireExplicitLogin');
    
    // Reset state
    setUserProfile(null);
    setLoggedIn(false);
    setRedirectToHome(false);
    setIsLogin(true);
  };

  // If profile setup is showing, render that instead of the auth form
  if (showProfileSetup) {
    return <ProfileSetup userData={userData} onComplete={handleProfileComplete} />;
  }

  // If user is logged in, show profile info
  if (loggedIn && userProfile) {
    return (
      <div className="profile-setup">
        <div className="heading-container">
          <h2>Welcome, {userProfile.displayName || userProfile.firstName}</h2>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar">
            {userProfile.avatar ? (
              <div className="avatar-image-container" style={{ position: 'relative' }}>
                <img 
                  src={userProfile.avatar.image} 
                  alt={userProfile.avatar.name} 
                  className={`avatar-image ${userProfile.avatar.name.toLowerCase().replace(/\s+/g, '-')}-avatar-img`}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 20px auto',
                    border: userProfile.avatar.name === 'Black Panther' ? 
                      '3px solid rgba(102, 51, 153, 0.8)' : 
                      userProfile.avatar.name === 'Wonder Woman' ?
                      '3px solid rgba(204, 0, 0, 0.8)' :
                      '3px solid rgba(255, 255, 255, 0.5)'
                  }}
                  onError={(e) => {
                    // Detailed error logging
                    console.log(`Failed to load profile image for ${userProfile.avatar.name}`);
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    const fallback = e.target.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  className={`fallback-avatar ${userProfile.avatar.name.toLowerCase().replace(/\s+/g, '-')}-avatar`}
                  style={{ 
                    display: 'none',
                    backgroundColor: userProfile.avatar.color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                    margin: '0 auto 20px auto',
                    position: 'absolute',
                    top: 0,
                    left: 'calc(50% - 50px)'
                  }}
                >
                  {userProfile.avatar.symbol}
                </div>
              </div>
            ) : (
              <div className="avatar-placeholder">No Avatar</div>
            )}
          </div>
          
          <div className="profile-details">
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}</p>
            <p><strong>Hero Identity:</strong> {userProfile.displayName || 'Not set'}</p>
            <p><strong>Hero Type:</strong> {userProfile.avatar?.name || 'Not selected'}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="button glow-effect"
            style={{ marginTop: '20px' }}
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <div className="heading-container">
        <h2 style={{ width: '100%', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back Hero' : 'Create Account'}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form-content">
        {!isLogin && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        
        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <button
          type="submit"
          className="button glow-effect"
        >
          {isLogin ? 'Sign In' : 'Continue'}
        </button>

        {isLogin && (
          <div style={{ marginTop: '1rem', textAlign: 'center', width: '100%' }}>
            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="google-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" style={{ marginRight: '10px' }}>
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Login with Google
            </button>
          </div>
        )}
      </form>
      
      <div className="toggle-form">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-button"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm; 