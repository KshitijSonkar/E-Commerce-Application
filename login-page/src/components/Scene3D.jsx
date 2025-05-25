import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Stars from './Stars';
import FloatingCube from './FloatingCube';

const Scene3D = () => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[-10, 10, 10]} intensity={1} color="#ffffff" />
      
      <Suspense fallback={null}>
        <Stars />
        
        {/* Decorative floating cubes */}
        <FloatingCube position={[-2, -1, -2]} color="#4299e1" size={0.3} speed={0.7} />
        <FloatingCube position={[2, 1, -3]} color="#9f7aea" size={0.4} speed={1.2} />
        <FloatingCube position={[-1, 1.5, -2.5]} color="#38b2ac" size={0.2} speed={0.9} />
        <FloatingCube position={[1.5, -0.5, -1.5]} color="#ed8936" size={0.3} speed={1.1} />
        <FloatingCube position={[0, -2, -3]} color="#ef4444" size={0.25} speed={0.8} />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default Scene3D; 