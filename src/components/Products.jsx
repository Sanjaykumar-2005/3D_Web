import { motion } from 'framer-motion';
import { OrbitControls } from '@react-three/drei';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import Scene from './canvas/Scene';
import HeadphoneModel from './canvas/HeadphoneModel';
import SpeakerModel from './canvas/SpeakerModel';
import EarbudModel from './canvas/EarbudModel';

const products = [
  {
    tag: '01 / Flagship',
    name: 'Auralis Halo Pro',
    desc: 'Reference over-ear with adaptive ANC and titanium drivers.',
    price: '$549',
    Model: HeadphoneModel,
    color: '#a85bff',
  },
  {
    tag: '02 / Compact',
    name: 'Auralis Drift',
    desc: 'In-ear monitors with 360° head-tracked spatial sound.',
    price: '$299',
    Model: EarbudModel,
    color: '#4dd5ff',
  },
  {
    tag: '03 / Studio',
    name: 'Auralis Resonance',
    desc: 'Tabletop speaker with room-aware acoustic calibration.',
    price: '$899',
    Model: SpeakerModel,
    color: '#5b8cff',
  },
];

function ProductCard({ p, index }) {
  const Model = p.Model;

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
    >
      <div className="product-canvas">
        <span className="product-tag">{p.tag}</span>
        <span className="product-drag-hint">
          <MousePointer2 size={11} /> drag
        </span>
        <Scene cameraPosition={[0, 0, 4.4]} fov={36} environment={true}>
          <Model color={p.color} autoRotate={false} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            autoRotate
            autoRotateSpeed={0.6}
            makeDefault
          />
        </Scene>
      </div>
      <div className="product-info">
        <span className="name">{p.name}</span>
        <span className="desc">{p.desc}</span>
      </div>
      <div className="product-meta">
        <span className="product-price">{p.price}</span>
        <a href="#contact" className="product-cta">
          Configure <ArrowUpRight size={14} />
        </a>
      </div>
    </motion.article>
  );
}

export default function Products() {
  return (
    <section className="section" id="products">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">The Lineup</span>
          <h2>
            Engineered for <span className="gradient-text">every listening ritual.</span>
          </h2>
          <p>
            Three flagship instruments, one acoustic philosophy. Each model is
            tuned by our reference studio in Tokyo and validated against the
            Harman target with bespoke spatial extensions.
          </p>
        </motion.div>

        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
