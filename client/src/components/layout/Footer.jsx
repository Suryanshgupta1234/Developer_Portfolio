import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Heart, Code2, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const Footer = () => {
  const { socialLinks, visitorCount } = usePortfolio();

  const links = [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Resume', href: '/resume' },
    { label: 'Admin', href: '/admin' },
  ];

  const socials = [
    { icon: <Github size={18} />, href: socialLinks?.github || '#', label: 'GitHub' },
    { icon: <Linkedin size={18} />, href: socialLinks?.linkedin || '#', label: 'LinkedIn' },
    { icon: <Twitter size={18} />, href: socialLinks?.twitter || '#', label: 'Twitter' },
    { icon: <Mail size={18} />, href: `mailto:${socialLinks?.email || 'hello@dev.com'}`, label: 'Email' },
  ];

  return (
    <footer className="relative border-t border-white/10 overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Code2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg">Dev<span className="text-blue-500">.</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Building innovative solutions with clean code, modern design, and a passion for engineering.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/30">Visitors:</span>
              <span className="text-xs font-mono text-blue-400">{visitorCount.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/10 text-white/50 hover:text-white text-sm transition-all group"
                  aria-label={s.label}
                >
                  {s.icon}
                  <span>{s.label}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="glow-line mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <p>© {new Date().getFullYear()} Developer Portfolio. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart size={14} className="text-red-400 fill-red-400" /> using React & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
