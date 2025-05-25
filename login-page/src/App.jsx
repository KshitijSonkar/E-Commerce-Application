import React from 'react';
import Scene3D from './components/Scene3D';
import AuthForm from './components/AuthForm';
import './App.css';

const App = () => {
  return (
    <div className="starry-background">
      {/* Nebula effects */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="nebula nebula-3"></div>
    
      {/* Shooting Stars */}
      {[...Array(6)].map((_, index) => (
        <div key={`shooting-star-${index}`} className="shooting-star"></div>
      ))}
      
      {/* Twinkling Stars */}
      {[...Array(6)].map((_, index) => (
        <div key={`twinkling-star-${index}`} className="twinkling-star"></div>
      ))}
      
      {/* 3D Background */}
      <div className="scene-container" style={{ position: 'relative', zIndex: 2 }}>
        <Scene3D />
      </div>
      
      {/* Container for content */}
      <div 
        className="animate-float" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0, 
          zIndex: 10, 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100vh'
        }}
      >
        <AuthForm />
      </div>
      
      {/* Branding */}
      <div className="brand">
        <span className="gradient-text">
          Superhero World
        </span>
      </div>
    </div>
  );
};

export default App; 