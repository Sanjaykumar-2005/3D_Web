import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    quote:
      'I’ve owned every flagship released in the last decade. The Halo Pro is the first pair where I forgot the headphones were on within minutes. The soundstage is just… true.',
    name: 'Aria Vance',
    role: 'Mixing Engineer · Atlas Studios',
    initials: 'AV',
  },
  {
    quote:
      'AURALIS basically rebuilt ANC from first principles. On a transatlantic flight I literally stopped hearing the cabin and started hearing the score the way the composer intended.',
    name: 'Marcus Liang',
    role: 'Score Composer',
    initials: 'ML',
  },
  {
    quote:
      'The spatial mode is unreal. Walking through the city, podcasts feel like they’re happening in front of me — not glued to my ears. It’s the upgrade I didn’t know I needed.',
    name: 'Priya Shah',
    role: 'Product Designer · Lumen',
    initials: 'PS',
  },
];

export default function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">From the Field</span>
          <h2>
            Quietly trusted by{' '}
            <span className="gradient-text">people who hear for a living.</span>
          </h2>
        </motion.div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <motion.figure
              key={r.name}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              animate={{ y: [0, -6, 0] }}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <div className="stars" aria-label="5 out of 5">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>
              <blockquote className="testimonial-quote">{r.quote}</blockquote>
              <figcaption className="testimonial-author">
                <span className="author-avatar">{r.initials}</span>
                <div className="author-info">
                  <div className="name">{r.name}</div>
                  <div className="role">{r.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
