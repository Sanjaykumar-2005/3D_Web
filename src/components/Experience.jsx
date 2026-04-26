import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Building2, Music2, Mountain, Play, Pause, Volume2 } from 'lucide-react';
import Scene from './canvas/Scene';
import AudioVisualizer from './canvas/AudioVisualizer';
import useAudioSynth from '../hooks/useAudioSynth';

const modes = [
  {
    id: 'flight',
    title: 'In-Flight',
    blurb: 'Cabin-tuned ANC quiets engine drone without thinning vocals.',
    icon: <Plane size={18} />,
    a: 'rgba(91, 140, 255, 0.32)',
    b: 'rgba(77, 213, 255, 0.28)',
    color: '#5b8cff',
    freq: 96,
  },
  {
    id: 'studio',
    title: 'Studio',
    blurb: 'Reference profile with neutral imaging for critical listening.',
    icon: <Music2 size={18} />,
    a: 'rgba(168, 91, 255, 0.32)',
    b: 'rgba(255, 91, 209, 0.28)',
    color: '#a85bff',
    freq: 130,
  },
  {
    id: 'city',
    title: 'City Walk',
    blurb: 'Transparency mode lifts speech and traffic, mutes the rest.',
    icon: <Building2 size={18} />,
    a: 'rgba(77, 213, 255, 0.32)',
    b: 'rgba(91, 140, 255, 0.28)',
    color: '#4dd5ff',
    freq: 174,
  },
  {
    id: 'wild',
    title: 'Wilderness',
    blurb: 'Adaptive bass extension for open-air dynamics and weight.',
    icon: <Mountain size={18} />,
    a: 'rgba(255, 91, 209, 0.32)',
    b: 'rgba(168, 91, 255, 0.28)',
    color: '#ff5bd1',
    freq: 78,
  },
];

export default function Experience() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const m = modes[active];
  const { playing, toggle, setFreq, getAmplitude } = useAudioSynth({ baseFreq: m.freq });

  useEffect(() => {
    if (playing) setFreq(m.freq);
  }, [playing, m.freq, setFreq]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const t = e.target;
      if (t && t.matches && t.matches('input, textarea, [contenteditable=""], [contenteditable="true"]')) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3;
      if (!inView) return;
      e.preventDefault();
      setActive((i) =>
        e.key === 'ArrowRight'
          ? (i + 1) % modes.length
          : (i - 1 + modes.length) % modes.length
      );
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="experience"
      id="experience"
      style={{
        '--exp-color-a': m.a,
        '--exp-color-b': m.b,
      }}
    >
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Adaptive Experience</span>
          <h2>
            One pair of headphones.{' '}
            <span className="gradient-text">Every environment.</span>
          </h2>
          <p>
            AURALIS profiles continuously calibrate your audio to the moment.
            Switch contexts and watch the soundstage — and the room — react.
          </p>
        </motion.div>

        <div className="experience-modes">
          {modes.map((mode, i) => (
            <motion.button
              key={mode.id}
              className={`mode-card${active === i ? ' active' : ''}`}
              onClick={() => setActive(i)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              type="button"
            >
              <div className="mode-icon">{mode.icon}</div>
              <h4>{mode.title}</h4>
              <p>{mode.blurb}</p>
            </motion.button>
          ))}
        </div>

        <div className="experience-controls">
          <button
            className={`play-toggle${playing ? ' playing' : ''}`}
            onClick={toggle}
            type="button"
            aria-pressed={playing}
          >
            <span className="play-icon">
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </span>
            <span>{playing ? 'Pause Soundscape' : 'Play Soundscape'}</span>
            <AnimatePresence>
              {playing && (
                <motion.span
                  className="play-bars"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  {[0, 1, 2, 3].map((b) => (
                    <span key={b} className="bar" style={{ animationDelay: `${b * 0.12}s` }} />
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <span className="kbd-hint">
            <Volume2 size={13} />
            <span>Use </span>
            <kbd>←</kbd>
            <kbd>→</kbd>
            <span>to switch modes</span>
          </span>
        </div>

        <motion.div
          className="experience-visual"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
        >
          <Scene cameraPosition={[0, 0, 6]} fov={50} environment={false}>
            <AudioVisualizer
              count={500}
              radius={6}
              color={m.color}
              size={0.05}
              amplitude={getAmplitude}
            />
          </Scene>
        </motion.div>
      </div>
    </section>
  );
}
