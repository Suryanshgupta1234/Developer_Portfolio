import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { usePortfolio } from '../context/PortfolioContext';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const formRef = useRef(null);
  const { socialLinks } = usePortfolio();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all required fields');

    setSending(true);
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      }
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent!');
    } catch {
      toast.error('Something went wrong. Try emailing directly.');
    } finally {
      setSending(false);
    }
  };

  const contactItems = [
    { icon: <Mail size={20} />, label: 'Email', value: socialLinks?.email || 'hello@dev.com', href: `mailto:${socialLinks?.email || 'hello@dev.com'}` },
    { icon: <Phone size={20} />, label: 'Phone', value: socialLinks?.phone || '+91 00000 00000', href: `tel:${socialLinks?.phone || ''}` },
    { icon: <MapPin size={20} />, label: 'Location', value: socialLinks?.location || 'India', href: null },
  ];

  const socials = [
    { icon: <Github size={18} />, href: socialLinks?.github || '#', label: 'GitHub' },
    { icon: <Linkedin size={18} />, href: socialLinks?.linkedin || '#', label: 'LinkedIn' },
    { icon: <Twitter size={18} />, href: socialLinks?.twitter || '#', label: 'Twitter' },
  ];

  return (
    <div className="pt-20 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading tag="Say Hi" title="Get In Touch" subtitle="Have a project, opportunity, or just want to connect? I'm all ears." />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left — info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white hover:text-blue-400 transition-colors text-sm font-medium">{item.value}</a>
                    ) : (
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">Connect Online</p>
              <div className="flex gap-3">
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all text-sm">
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="glass rounded-2xl p-5 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 font-medium text-sm">Available for Work</span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Open to full-time SDE roles, internships, and interesting freelance projects. Response time: within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-3">
            <div className="glass rounded-2xl p-8 border border-white/10">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center gap-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white">Message Sent!</h3>
                    <p className="text-white/50">Thanks for reaching out. I'll get back to you soon.</p>
                    <button onClick={() => setSent(false)} className="mt-2 text-sm text-blue-400 hover:underline">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm text-white/50 mb-1.5">Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm text-white/50 mb-1.5">Email *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-1.5">Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry, opportunity..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm text-white/50 mb-1.5">Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={6} required
                        placeholder="Hi, I'd like to discuss..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/60 transition-all text-sm resize-none" />
                    </div>
                    <motion.button type="submit" disabled={sending}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-60">
                      {sending ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={18} /> Send Message</>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
