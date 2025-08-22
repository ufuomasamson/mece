import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import Background3D from './Background3D';
import FloatingShapes from './FloatingShapes';

interface Scene3DProps {
  children: React.ReactNode;
}

const Scene3D = ({ children }: Scene3DProps) => {
  return (
    <div className="relative w-full h-full">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.1} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          
          <Background3D />
          <FloatingShapes />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false}
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

export default Scene3D;
