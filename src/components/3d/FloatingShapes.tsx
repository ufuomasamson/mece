import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Torus, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  const boxRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const cylinderRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      boxRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      boxRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      sphereRef.current.rotation.z = state.clock.elapsedTime * 0.4;
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime + 1) * 0.3;
    }
    
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      torusRef.current.position.y = Math.sin(state.clock.elapsedTime + 2) * 0.4;
    }
    
    if (cylinderRef.current) {
      cylinderRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      cylinderRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      cylinderRef.current.position.y = Math.sin(state.clock.elapsedTime + 3) * 0.6;
    }
  });

  return (
    <group>
      {/* Floating Box */}
      <Box
        ref={boxRef}
        args={[0.5, 0.5, 0.5]}
        position={[-3, 2, -5]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>

      {/* Floating Sphere */}
      <Sphere
        ref={sphereRef}
        args={[0.4, 32, 32]}
        position={[3, -1, -4]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#f59e0b"
          transparent
          opacity={0.7}
          metalness={0.6}
          roughness={0.3}
        />
      </Sphere>

      {/* Floating Torus */}
      <Torus
        ref={torusRef}
        args={[0.3, 0.1, 16, 32]}
        position={[-2, -2, -6]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.8}
          metalness={0.7}
          roughness={0.1}
        />
      </Torus>

      {/* Floating Cylinder */}
      <Cylinder
        ref={cylinderRef}
        args={[0.2, 0.2, 0.8, 32]}
        position={[2, 1, -7]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>
    </group>
  );
};

export default FloatingShapes;
