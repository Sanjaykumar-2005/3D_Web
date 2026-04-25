import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/**
 * Compact futuristic speaker — stacked cylinders + glowing diffuser.
 */
export default function SpeakerModel({ color = '#a85bff', autoRotate = true }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current && autoRotate) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref} rotation={[0.1, 0.4, 0]} scale={1.05}>
        {/* Body */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.75, 0.85, 1.5, 64]} />
          <meshStandardMaterial color="#0c1024" metalness={0.9} roughness={0.18} />
        </mesh>
        {/* Top diffuser */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.18, 64]} />
          <meshStandardMaterial color="#13183a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glow ring */}
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.025, 24, 96]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
        {/* Sub ring */}
        <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.78, 0.018, 16, 96]} />
          <meshStandardMaterial
            color="#4dd5ff"
            emissive="#4dd5ff"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
        {/* Crown */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
