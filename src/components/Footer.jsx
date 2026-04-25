import { Github, Instagram, Twitter, Youtube } from 'lucide-react';

const cols = [
  {
    h: 'Products',
    items: ['Halo Pro', 'Drift', 'Resonance', 'Compare', 'Accessories'],
  },
  {
    h: 'Company',
    items: ['About', 'Studio', 'Press', 'Sustainability', 'Careers'],
  },
  {
    h: 'Support',
    items: ['Help Center', 'Warranty', 'Repairs', 'Returns', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#top" className="brand">
              <span className="brand-mark" />
              <span>AURALIS</span>
            </a>
            <p>
              Premium audio instruments, designed and tuned in our acoustic lab
              in Tokyo. Built to last for the way music actually moves.
            </p>
          </div>

          {cols.map((c) => (
            <div className="footer-col" key={c.h}>
              <h5>{c.h}</h5>
              <ul>
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Auralis Audio Labs · Crafted with sound in mind.</span>
          <div className="socials">
            <a className="icon-btn" href="#" aria-label="Twitter"><Twitter size={14} /></a>
            <a className="icon-btn" href="#" aria-label="Instagram"><Instagram size={14} /></a>
            <a className="icon-btn" href="#" aria-label="YouTube"><Youtube size={14} /></a>
            <a className="icon-btn" href="#" aria-label="GitHub"><Github size={14} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
