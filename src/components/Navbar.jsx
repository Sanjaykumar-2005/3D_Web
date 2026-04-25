import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag, Search } from 'lucide-react';

const links = [
  { href: '#products', id: 'products', label: 'Products' },
  { href: '#technology', id: 'technology', label: 'Technology' },
  { href: '#experience', id: 'experience', label: 'Experience' },
  { href: '#testimonials', id: 'testimonials', label: 'Reviews' },
  { href: '#contact', id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['top', ...links.map((l) => l.id)];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio currently
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      className={`navbar${scrolled ? ' scrolled' : ''}`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-inner glass-strong">
        <a href="#top" className="brand">
          <span className="brand-mark" />
          <span>AURALIS</span>
        </a>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={active === l.id ? 'active' : ''}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={16} />
          </button>
          <button className="icon-btn" aria-label="Cart">
            <ShoppingBag size={16} />
          </button>
          <a href="#contact" className="btn btn-primary">
            Pre-Order
          </a>
          <button className="icon-btn nav-toggle" aria-label="Menu">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
