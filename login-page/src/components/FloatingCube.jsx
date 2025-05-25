import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';

const FloatingCube = ({ position = [0, 0, -3], size = 0.5, color = '#4299e1', speed = 1 }) => {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3 * speed);
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4 * speed);
      mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.1;
    }
  });

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={[size, size, size]} />
      <MeshWobbleMaterial 
        color={color} 
        factor={0.3} 
        speed={1} 
        metalness={0.4}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export default FloatingCube; 