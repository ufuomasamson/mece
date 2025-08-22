import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Points, PointMaterial, Sphere, Torus } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

// Animated Cube Component - Made larger and brighter
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
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        transparent
        opacity={0.7}
        metalness={0.3}
        roughness={0.7}
        emissive="#1e40af"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Floating Sphere Component - Made larger and brighter
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
      args={[0.8, 16, 16]}
      position={[8, 0, -8]}
    >
      <meshStandardMaterial
        color="#f59e0b"
        transparent
        opacity={0.6}
        metalness={0.3}
        roughness={0.7}
        emissive="#d97706"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
};

// Floating Torus Component - Made larger and brighter
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
      args={[0.6, 0.2, 16, 32]}
      position={[-8, 0, -8]}
    >
      <meshStandardMaterial
        color="#10b981"
        transparent
        opacity={0.6}
        metalness={0.3}
        roughness={0.7}
        emissive="#059669"
        emissiveIntensity={0.3}
      />
    </Torus>
  );
};

// Floating Particles Component - Made more visible
const FloatingParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
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
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const Background3DScene = () => {
  console.log('Background3DScene component rendering'); // Debug log
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        zIndex: -1, // Move behind all content
        backgroundColor: 'transparent' // Remove debug background
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }} // Move camera further back
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl, scene }) => {
          console.log('3D Scene created!', { gl, scene });
          // Debug: log when scene is created
        }}
        onError={(error) => {
          console.error('3D Scene error:', error);
        }}
      >
        {/* Background lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        
        {/* Move objects to background positions */}
        <AnimatedCube />
        <FloatingSphere />
        <FloatingTorus />
        <FloatingParticles />
        
        {/* Remove OrbitControls to prevent interaction */}
      </Canvas>
    </div>
  );
};

export default Background3DScene;
