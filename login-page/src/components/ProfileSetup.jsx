import React, { useState } from 'react';

const ProfileSetup = ({ userData, onComplete }) => {
  const [profile, setProfile] = useState({
    displayName: userData?.firstName || '',
    selectedAvatar: null,
  });
  
  // Add image path for Superman
  const [avatars, setAvatars] = useState([
    { id: 1, name: 'Superman', color: '#0066ff', symbol: 'S', image: '/assets/avatars/superman.png' },
    { id: 2, name: 'Batman', color: '#333333', symbol: 'B', image: '/assets/avatars/batman.png' },
    { id: 3, name: 'Wonder Woman', color: '#cc0000', symbol: 'W', image: '/assets/avatars/wonderwomen.png' },
    { id: 4, name: 'Spider-Man', color: '#ff3333', symbol: 'S', image: '/assets/avatars/spiderman.png' },
    { id: 5, name: 'Iron Man', color: '#ffcc00', symbol: 'I', image: '/assets/avatars/ironman.png' },
    { id: 6, name: 'Black Panther', color: '#663399', symbol: 'P', image: '/assets/avatars/blackpanther.png' },
    { id: 7, name: 'Captain America', color: '#3366cc', symbol: 'A', image: '/assets/avatars/captainamerica.png' },
    { id: 8, name: 'Thor', color: '#cc9900', symbol: 'T', image: '/assets/avatars/thor.png' }
  ]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const selectAvatar = (avatar) => {
    setProfile(prev => ({
      ...prev,
      selectedAvatar: avatar
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.selectedAvatar) {
      alert('Please select a superhero avatar');
      return;
    }
    onComplete({
      ...userData,
      displayName: profile.displayName,
      avatar: profile.selectedAvatar
    });
  };

  // Render the superhero avatar
  const renderAvatar = (avatar) => {
    // For all avatars
    return (
      <div className="avatar-image-container" style={{ position: 'relative' }}>
        <img 
          src={avatar.image} 
          alt={avatar.name} 
          className={`avatar-image ${avatar.name.toLowerCase().replace(/\s+/g, '-')}-avatar-img`}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: avatar.name === 'Black Panther' ? '2px solid rgba(102, 51, 153, 0.8)' : 
                  avatar.name === 'Wonder Woman' ? '2px solid rgba(204, 0, 0, 0.8)' :
                  '2px solid rgba(255, 255, 255, 0.3)'
          }}
          onError={(e) => {
            console.log(`Failed to load image for ${avatar.name}`);
            e.target.style.display = 'none';
            const fallback = e.target.parentNode.querySelector('.fallback-avatar');
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div 
          className={`fallback-avatar ${avatar.name.toLowerCase().replace(/\s+/g, '-')}-avatar`}
          style={{ 
            display: 'none',
            backgroundColor: avatar.color,
            justifyContent: 'center',
            alignItems: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {avatar.symbol}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-setup">
      <div className="heading-container">
        <h2>Choose Your Superhero Identity</h2>
        <p className="subtitle">Select an avatar to represent you in the Superhero World</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={profile.displayName}
            onChange={handleInputChange}
            required
            placeholder="Enter your superhero name"
          />
        </div>

        <div className="avatar-selection">
          <label>Choose Your Avatar</label>
          <div className="avatar-grid">
            {avatars.map(avatar => (
              <div 
                key={avatar.id}
                className={`avatar-option ${profile.selectedAvatar?.id === avatar.id ? 'selected' : ''}`}
                onClick={() => selectAvatar(avatar)}
              >
                {renderAvatar(avatar)}
                <span>{avatar.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="button glow-effect"
        >
          Complete Setup
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup; 