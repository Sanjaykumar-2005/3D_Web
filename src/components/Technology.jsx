import { motion } from 'framer-motion';
import { Activity, Brain, Radio, ShieldCheck } from 'lucide-react';
import { OrbitControls } from '@react-three/drei';
import Scene from './canvas/Scene';
import { SoundRings } from './canvas/AudioVisualizer';

const features = [
  {
    icon: <Radio size={20} />,
    title: 'Spatial Imaging',
    body:
      'A 12-band binaural renderer reconstructs full 360° soundstages from any stereo source — head-tracked in real time.',
  },
  {
    icon: <Brain size={20} />,
    title: 'Adaptive ANC',
    body:
      'On-device neural model classifies your environment 48,000× per second and shapes the cancellation curve to match.',
  },
  {
    icon: <Activity size={20} />,
    title: 'Titanium Drivers',
    body:
      '40 mm laminated titanium-PEEK transducers deliver effortless dynamics with sub-1% distortion at reference levels.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Lossless Everywhere',
    body:
      'Bit-perfect 24-bit / 192 kHz wireless via our proprietary AURA-Link codec, with a wired USB-C fallback.',
  },
];

export default function Technology() {
  return (
    <section className="section" id="technology">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Inside the Sound</span>
          <h2>
            A signal chain <span className="gradient-text">re-built from silicon.</span>
          </h2>
          <p>
            Every AURALIS device pairs custom DSP with a dedicated neural
            co-processor. The result is sound that adapts to your body, your
            posture, and the room around you.
          </p>
        </motion.div>

        <div className="tech-grid">
          <motion.div
            className="tech-card-list"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="tech-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="tech-icon">{f.icon}</div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="tech-visual"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <Scene cameraPosition={[0, 0, 5]} fov={42}>
              <SoundRings color="#a85bff" count={6} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableDamping
                dampingFactor={0.08}
                rotateSpeed={0.5}
                makeDefault
              />
            </Scene>

            <span className="tech-pill tl">
              <span className="pill-dot" /> Spatial 360°
            </span>
            <span className="tech-pill tr">
              <span className="pill-dot" /> Neural ANC
            </span>
            <span className="tech-pill bl">
              <span className="pill-dot" /> 24-bit Lossless
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
