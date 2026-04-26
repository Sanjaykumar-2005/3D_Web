import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

function useInView(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView((v) => (v === entry.isIntersecting ? v : entry.isIntersecting)),
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

const CAPPED_DPR =
  typeof window === 'undefined' ? 1.25 : Math.min(window.devicePixelRatio || 1, 1.5);

const GL_OPTS = { antialias: true, alpha: true, powerPreference: 'high-performance' };

/**
 * Scene — reusable Canvas wrapper.
 * - Pauses the render loop when the canvas is fully off-screen
 * - Caps DPR to keep pixel counts sane on hi-DPI displays
 * - Environment HDR is opt-in via the `environment` prop (it's expensive)
 */
export default function Scene({
  children,
  cameraPosition = [0, 0, 4.5],
  fov = 38,
  background = false,
  environment = false,
  pauseWhenOffscreen = true,
  className,
  dpr,
}) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const frameloop = pauseWhenOffscreen ? (inView ? 'always' : 'never') : 'always';

  return (
    <div ref={wrapRef} className="scene-wrap">
      <Canvas
        className={className}
        dpr={dpr ?? CAPPED_DPR}
        frameloop={frameloop}
        gl={GL_OPTS}
        camera={{ position: cameraPosition, fov }}
      >
        {background && <color attach="background" args={['#04050b']} />}

        {/* 3-point + rim — no shadow maps to keep this cheap */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 6, 6]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-5, 3, -2]} intensity={0.9} color="#5b8cff" />
        <pointLight position={[3, -4, 4]} intensity={1.6} color="#a85bff" distance={14} />
        <pointLight position={[-4, 4, -4]} intensity={1.0} color="#4dd5ff" distance={14} />

        <Suspense fallback={null}>
          {environment && <Environment preset="night" />}
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
