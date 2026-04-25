import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { OrbitControls } from '@react-three/drei';
import { ArrowRight, Play, Sparkles, Headphones, MousePointer2 } from 'lucide-react';
import Scene from './canvas/Scene';
import HeadphoneModel from './canvas/HeadphoneModel';
import AudioVisualizer from './canvas/AudioVisualizer';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.21, 0.65, 0.36, 1] },
});

function Counter({ from = 0, to, prefix = '', suffix = '', delay = 0, duration = 1.6 }) {
  const value = useMotionValue(from);
  const display = useTransform(value, (v) =>
    `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  );
  useEffect(() => {
    const controls = animate(value, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [to, delay, duration, value]);
  return <motion.span>{display}</motion.span>;
}

export default function Hero() {
  const [hovered, setHovered] = useState(false);

  return (
    <header className="hero" id="top">
      {/* Ambient particle field — mouse-parallax. No environment, no lighting needs. */}
      <div className="hero-canvas">
        <Scene cameraPosition={[0, 0, 6]} fov={55} environment={false}>
          <AudioVisualizer count={300} radius={7} color="#5b8cff" size={0.035} />
        </Scene>
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" {...fade(0.05)}>
            <Sparkles size={12} /> Next-gen spatial audio
          </motion.span>

          <motion.h1 {...fade(0.15)}>
            Sound,
            <br />
            <span className="accent">reimagined</span> in 3D.
          </motion.h1>

          <motion.p className="hero-sub" {...fade(0.3)}>
            Meet AURALIS — premium audio engineered with adaptive noise
            sculpting, dynamic spatial imaging, and titanium-grade acoustics.
            Built for the way you actually listen.
          </motion.p>

          <motion.div className="hero-actions" {...fade(0.45)}>
            <a href="#products" className="btn btn-primary">
              Explore the Lineup <ArrowRight size={16} />
            </a>
            <a href="#experience" className="btn btn-ghost">
              <Play size={14} /> Watch Demo
            </a>
          </motion.div>

          <motion.div className="hero-stats" {...fade(0.6)}>
            <div className="hero-stat">
              <div className="num">
                <Counter to={42} suffix="h" delay={0.9} />
              </div>
              <div className="lbl">Battery</div>
            </div>
            <div className="hero-stat">
              <div className="num">
                <Counter from={0} to={-38} prefix="" suffix="dB" delay={1.0} />
              </div>
              <div className="lbl">Noise Floor</div>
            </div>
            <div className="hero-stat">
              <div className="num">
                <Counter to={360} suffix="°" delay={1.1} />
              </div>
              <div className="lbl">Spatial</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="frame">
            <Scene cameraPosition={[0, 0, 4.6]} fov={36} environment={true}>
              <HeadphoneModel scale={1.0} color="#a85bff" autoRotate={false} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.7}
                autoRotate
                autoRotateSpeed={hovered ? 0 : 0.7}
                makeDefault
              />
            </Scene>

            <div className="drag-hint">
              <MousePointer2 size={12} /> Drag to rotate
            </div>
          </div>

          <motion.div
            className="hero-badge tl glass-strong"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span className="dot" />
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)' }}>
                ANC ACTIVE
              </div>
              <div style={{ fontWeight: 600 }}>Adaptive Mode</div>
            </div>
          </motion.div>

          <motion.div
            className="hero-badge br glass-strong"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <Headphones size={18} color="var(--neon-cyan)" />
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-dim)' }}>
                LOSSLESS
              </div>
              <div style={{ fontWeight: 600 }}>24-bit / 192 kHz</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="scroll-hint">
        <span className="track" />
        <span>Scroll</span>
      </div>
    </header>
  );
}
