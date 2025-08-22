import { Canvas } from '@react-three/fiber';

interface TestScene3DProps {
  children: React.ReactNode;
}

const TestScene3D = ({ children }: TestScene3DProps) => {
  return (
    <div className="relative w-full h-full">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10" style={{ width: '100vw', height: '100vh', backgroundColor: 'red' }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ 
            width: '100%',
            height: '100%'
          }}
        >
          <ambientLight intensity={1} />
          
          {/* Simple red cube */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        </Canvas>
      </div>
      
      {/* Website Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default TestScene3D;
