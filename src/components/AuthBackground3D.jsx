import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';

function FloatingShape({ position, geometry, color, speed = 1, distort = 0.35 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1 * speed;
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.6} floatIntensity={1.4} position={position}>
      <mesh ref={ref}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          roughness={0.25}
          metalness={0.6}
          distort={distort}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={25} color="#b91c1c" />

      <FloatingShape position={[-2.6, 1.2, -2]} geometry={<torusKnotGeometry args={[0.9, 0.28, 128, 32]} />} color="#18181b" speed={0.8} />
      <FloatingShape position={[2.8, -0.8, -3]} geometry={<icosahedronGeometry args={[1.1, 1]} />} color="#3f3f46" speed={1.1} distort={0.5} />
      <FloatingShape position={[0.4, 2.4, -4]} geometry={<octahedronGeometry args={[0.8, 0]} />} color="#71717a" speed={0.6} distort={0.2} />
      <FloatingShape position={[-1.8, -2.2, -3.5]} geometry={<dodecahedronGeometry args={[0.7, 0]} />} color="#27272a" speed={1.3} />

      <Sparkles count={80} scale={[10, 10, 6]} size={2} speed={0.3} color="#ffffff" opacity={0.6} />
      <fog attach="fog" args={['#0a0a0b', 4, 12]} />
    </>
  );
}

export default function AuthBackground3D() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0a0a0b']} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
