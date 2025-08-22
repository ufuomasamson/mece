import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Background3D = () => {
  const ref = useRef<THREE.Points>(null);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Create particles
  const particles = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      colors[i * 3] = Math.random() * 0.5 + 0.5; // Blue to white
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.7; // Green to white
      colors[i * 3 + 2] = Math.random() * 0.8 + 0.2; // Blue to white
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points
      ref={ref}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.02 * aspect}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default Background3D;
