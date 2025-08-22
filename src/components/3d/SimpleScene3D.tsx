import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial, Sphere, Torus } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Animated Cube Component
const AnimatedCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent
        opacity={0.8}
        metalness={0.7}
        roughness={0.2}
      />
    </mesh>
  );
};

// Floating Sphere Component
const FloatingSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.4;
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime + 1) * 0.3;
    }
  });

  return (
    <Sphere
      ref={sphereRef}
      args={[0.3, 16, 16]}
      position={[2, 0, -3]}
    >
      <meshStandardMaterial
        color="#f59e0b"
        transparent
        opacity={0.6}
        metalness={0.6}
        roughness={0.3}
      />
    </Sphere>
  );
};

// Floating Torus Component
const FloatingTorus = () => {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      torusRef.current.position.y = Math.sin(state.clock.elapsedTime + 2) * 0.4;
    }
  });

  return (
    <Torus
      ref={torusRef}
      args={[0.2, 0.08, 12, 24]}
      position={[-2, 0, -4]}
    >
      <meshStandardMaterial
        color="#10b981"
        transparent
        opacity={0.7}
        metalness={0.7}
        roughness={0.1}
      />
    </Torus>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    const colors = new Float32Array(500 * 3);
    
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      colors[i * 3] = Math.random() * 0.5 + 0.5; // Blue to white
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.7; // Green to white
      colors[i * 3 + 2] = Math.random() * 0.8 + 0.2; // Blue to white
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points
      ref={pointsRef}
      positions={particles.positions}
      colors={particles.colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

interface SimpleScene3DProps {
  children: React.ReactNode;
}

const SimpleScene3D = ({ children }: SimpleScene3DProps) => {
  return (
    <div className="relative w-full h-full">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
          <pointLight position={[5, 5, -5]} intensity={0.3} color="#10b981" />
          
          <AnimatedCube />
          <FloatingSphere />
          <FloatingTorus />
          <FloatingParticles />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      
      {/* Website Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SimpleScene3D;
