import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const channels = [
  {
    icon: <Mail size={18} />,
    label: 'Email',
    value: 'sound@auralis.audio',
  },
  {
    icon: <Phone size={18} />,
    label: 'Press',
    value: '+1 (415) 555-0142',
  },
  {
    icon: <MapPin size={18} />,
    label: 'Studio',
    value: 'Shibuya · Tokyo · 150-0002',
  },
];

export default function Contact() {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setStatus('');
    // Simulated submit; replace with real endpoint when available.
    setTimeout(() => {
      setPending(false);
      setStatus('Message received — our team will reply within 24 hours.');
      e.target.reset();
    }, 900);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className="section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">Get In Touch</span>
          <h2>
            Reserve a demo or{' '}
            <span className="gradient-text">say hello.</span>
          </h2>
          <p>
            Whether you’re a studio, a retailer, or just curious about the way
            we tune our drivers — drop us a note. We answer every message
            personally.
          </p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {channels.map((c) => (
              <div key={c.label} className="contact-channel">
                <span className="icon">{c.icon}</span>
                <div>
                  <div className="lbl">{c.label}</div>
                  <div className="val">{c.value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="field-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" required placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required placeholder="you@studio.com" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" type="text" required placeholder="What can we help you with?" />
            </div>

            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required placeholder="Tell us what you’re building, listening to, or curious about..." />
            </div>

            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Sending…' : (
                <>
                  Send Message <Send size={14} />
                </>
              )}
            </button>

            <div className="form-status" aria-live="polite">{status}</div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
