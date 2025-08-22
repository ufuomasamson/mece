import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import * as THREE from 'three';

interface Card3DProps {
  position: [number, number, number];
  size: [number, number, number];
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}

const Card3D = ({ position, size, title, description, color, onClick }: Card3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Hover effect
      if (hovered) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.rotation.y = 0;
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = () => {
    setClicked(!clicked);
    onClick?.();
  };

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={size}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.8}
          metalness={0.7}
          roughness={0.2}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </Box>
      
      {/* Title */}
      <Text
        position={[0, size[1] / 2 + 0.1, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        maxWidth={size[0] - 0.2}
        textAlign="center"
      >
        {title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        maxWidth={size[0] - 0.2}
        textAlign="center"
      >
        {description}
      </Text>
    </group>
  );
};

export default Card3D;
