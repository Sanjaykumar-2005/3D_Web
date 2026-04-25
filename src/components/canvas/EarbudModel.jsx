import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/**
 * A pair of futuristic earbuds — capsule body + glowing tip.
 */
function Bud({ x = 0, color = '#5b8cff' }) {
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
      {/* Stem */}
      <mesh position={[0, -0.55, 0]}>
        <capsuleGeometry args={[0.13, 0.7, 8, 32]} />
        <meshStandardMaterial color="#0c1024" metalness={0.95} roughness={0.18} />
      </mesh>
      {/* Bud */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshStandardMaterial color="#13183a" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Glow tip */}
      <mesh position={[0.12, 0.16, 0.25]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function EarbudModel({ color = '#4dd5ff', autoRotate = true }) {
  const root = useRef();
  useFrame((_, dt) => {
    if (root.current && autoRotate) root.current.rotation.y += dt * 0.55;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.7}>
      <group ref={root} rotation={[0.1, 0.3, 0]} scale={1.4}>
        <Bud x={-0.6} color={color} />
        <Bud x={0.6} color={color} />
      </group>
    </Float>
  );
}
