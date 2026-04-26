import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Particle field that loosely simulates floating sound waves.
 * - Mouse parallax: subtle drift toward cursor
 * - Live audio reactivity: pass `amplitude` (a getter returning 0..1) to
 *   modulate displacement and rotation speed.
 */
export default function AudioVisualizer({
  count = 700,
  radius = 6,
  color = '#5b8cff',
  size = 0.04,
  amplitude,
}) {
  const points = useRef();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * (0.4 + Math.random() * 0.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
      speeds[i] = 0.4 + Math.random() * 1.4;
    }
    return { positions, speeds };
  }, [count, radius]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const amp = amplitude ? amplitude() : 0;
    const wave = 0.18 + amp * 0.9;

    const pos = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const baseY = positions[idx + 1];
      pos[idx + 1] = baseY + Math.sin(t * speeds[i] * 0.6 + i * 0.12) * wave;
    }
    points.current.geometry.attributes.position.needsUpdate = true;

    // rotation speeds up with audio energy
    points.current.rotation.y = t * (0.04 + amp * 0.25);

    // gentle parallax toward mouse
    points.current.rotation.x = THREE.MathUtils.lerp(
      points.current.rotation.x,
      state.mouse.y * 0.18,
      0.04
    );
    points.current.position.x = THREE.MathUtils.lerp(
      points.current.position.x,
      state.mouse.x * 0.6,
      0.04
    );
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * SoundRings — concentric pulsing torus rings for the Technology section.
 * Pass amplitude to drive the pulse in real time.
 */
export function SoundRings({ color = '#a85bff', count = 5, amplitude }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const amp = amplitude ? amplitude() : 0;

    group.current.children.forEach((ring, i) => {
      if (!ring.material) return;
      const phase = t * 0.6 + i * 0.7;
      const scale = 1 + Math.sin(phase) * 0.05 + i * 0.02 + amp * 0.4;
      ring.scale.setScalar(scale);
      ring.material.opacity = 0.35 + Math.sin(phase) * 0.25 + amp * 0.4;
    });
    group.current.rotation.y = t * (0.15 + amp * 0.4);
    group.current.rotation.x = Math.sin(t * 0.2) * 0.2 + state.mouse.y * 0.2;
  });

  const rings = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <group ref={group}>
      {rings.map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7 + i * 0.45, 0.012, 16, 128]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4dd5ff"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
