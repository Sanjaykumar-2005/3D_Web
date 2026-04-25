import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Technology from './components/Technology';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0; // target
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2; // current

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onTouch = (e) => {
      if (!e.touches?.[0]) return;
      tx = e.touches[0].clientX;
      ty = e.touches[0].clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${cx - 320}px, ${cy - 320}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden />;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return (
    <>
      <CursorGlow />
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Navbar />
      <main>
        <Hero />
        <div className="divider" />
        <Products />
        <Technology />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
