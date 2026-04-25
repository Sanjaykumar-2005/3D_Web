import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

/**
 * Stylized futuristic headphone built from primitives.
 * - Headband: TorusGeometry (top half)
 * - Earcups: Cylinders with emissive ring + glowing core
 * - Slider arms: thin cylinders connecting headband to earcups
 *
 * Designed to look hi-end without external GLTF assets.
 */
function Earcup({ side = 1, color = '#5b8cff' }) {
  const x = 1.3 * side;
  return (
    <group position={[x, -0.05, 0]} rotation={[0, (Math.PI / 2) * side, 0]}>
      {/* Outer shell */}
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.74, 0.42, 64]} />
        <meshStandardMaterial
          color="#0c1024"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Outer ring (emissive) */}
      <mesh position={[0, 0.215, 0]}>
        <torusGeometry args={[0.62, 0.035, 24, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          metalness={0.4}
          roughness={0.25}
          toneMapped={false}
        />
      </mesh>

      {/* Decorative inner ring */}
      <mesh position={[0, 0.225, 0]}>
        <torusGeometry args={[0.36, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#a85bff"
          emissiveIntensity={1.1}
          toneMapped={false}
        />
      </mesh>

      {/* Glowing core dot */}
      <mesh position={[0, 0.232, 0]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4dd5ff"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>

      {/* Foam pad (inside) */}
      <mesh position={[0, -0.215, 0]}>
        <cylinderGeometry args={[0.66, 0.62, 0.16, 48]} />
        <meshStandardMaterial color="#0a0c1a" roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  );
}

function SliderArm({ side = 1 }) {
  return (
    <group position={[1.05 * side, 0.55, 0]} rotation={[0, 0, (Math.PI / 14) * -side]}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.06, 0.85, 24]} />
        <meshStandardMaterial color="#1a1f3d" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function HeadphoneModel({
  scale = 1,
  autoRotate = true,
  color = '#5b8cff',
  floatIntensity = 0.6,
}) {
  const root = useRef();

  useFrame((state, delta) => {
    if (root.current && autoRotate) {
      root.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={floatIntensity}>
      <group ref={root} scale={scale} rotation={[0.18, 0.4, 0]}>
        {/* Headband (top arch) */}
        <mesh rotation={[0, 0, 0]} position={[0, 1.05, 0]}>
          <torusGeometry args={[1.05, 0.085, 24, 96, Math.PI]} />
          <meshStandardMaterial
            color="#1a1f3d"
            metalness={0.9}
            roughness={0.22}
          />
        </mesh>

        {/* Headband inner highlight */}
        <mesh rotation={[0, 0, 0]} position={[0, 1.05, 0.005]}>
          <torusGeometry args={[1.05, 0.018, 16, 96, Math.PI]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>

        {/* Slider arms */}
        <SliderArm side={1} />
        <SliderArm side={-1} />

        {/* Earcups */}
        <Earcup side={1} color={color} />
        <Earcup side={-1} color={color} />
      </group>
    </Float>
  );
}
