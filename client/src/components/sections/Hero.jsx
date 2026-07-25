import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight, Download, Mail, Github, Linkedin, ChevronDown } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { TYPING_ROLES, PERSONAL_DATA, SOCIAL_LINKS } from '../../utils/constants';
import ParticlesBackground from '../common/ParticlesBackground';

const FLOATING_CODE = [
  'const dev = new Developer();',
  'git commit -m "feat: ship"',
  'npm run build',
  'docker build -t app .',
  'SELECT * FROM skills;',
  '> yarn start',
  'while(alive) { code(); }',
  'import React from "react"',
];

const CodeSnippet = ({ text, style, duration, delay }) => (
  <motion.div
    className="absolute font-mono text-xs text-blue-400 pointer-events-none select-none whitespace-nowrap"
    style={style}
    initial={{ opacity: 0.08 }}
    animate={{ y: [0, -15, 0], opacity: [0.08, 0.18, 0.08] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    {text}
  </motion.div>
);

const Hero = () => {
  const { settings, socialLinks } = usePortfolio();
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax blobs
  const blob1X = useTransform(mouseX, [0, 1], [-30, 30]);
  const blob1Y = useTransform(mouseY, [0, 1], [-30, 30]);
  const blob2X = useTransform(mouseX, [0, 1], [30, -30]);
  const blob2Y = useTransform(mouseY, [0, 1], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const typingSequence = TYPING_ROLES.flatMap(role => [role, 2000]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Particles background */}
      <ParticlesBackground />

      {/* Animated gradient blobs */}
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)',
            'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      {/* Floating code snippets */}
      {FLOATING_CODE.map((text, i) => (
        <CodeSnippet
          key={i}
          text={text}
          duration={5 + (i * 0.7) % 4}
          delay={(i * 0.4) % 3}
          style={{
            left: `${5 + (i * 13) % 85}%`,
            top: `${10 + (i * 17) % 70}%`,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Available for opportunities</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-none tracking-tight"
        >
          <span className="text-white">
            {settings?.heroName || PERSONAL_DATA.name}
          </span>
          <br />
          <span className="gradient-text">
            {settings?.heroTagline || PERSONAL_DATA.tagline}
          </span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl sm:text-2xl font-mono text-white/60 mb-8 h-8"
        >
          <span className="text-blue-400">&gt; </span>
          <TypeAnimation
            sequence={typingSequence}
            wrapper="span"
            speed={50}
            deletionSpeed={60}
            repeat={Infinity}
            style={{ color: 'rgba(255,255,255,0.7)' }}
          />
          <span className="animate-pulse ml-0.5 text-blue-400">_</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {settings?.heroBio || PERSONAL_DATA.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link to="/projects">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-glow-sm hover:shadow-glow"
            >
              View Projects <ArrowRight size={18} />
            </motion.button>
          </Link>

          <a href={settings?.resumeUrl || '/resume'} download>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:bg-white/5"
            >
              <Download size={18} /> Download CV
            </motion.button>
          </a>

          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 glass hover:bg-white/10 text-white/80 font-semibold px-7 py-3.5 rounded-xl transition-all border border-white/10 hover:border-white/20"
            >
              <Mail size={18} /> Contact Me
            </motion.button>
          </Link>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center justify-center gap-4"
        >
          {[
            { icon: <Github size={20} />, href: socialLinks?.github || SOCIAL_LINKS.github, label: 'GitHub' },
            { icon: <Linkedin size={20} />, href: socialLinks?.linkedin || SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl glass hover:bg-white/10 text-white/50 hover:text-white transition-all border border-white/10 hover:border-white/20 hover:shadow-glow-sm"
            >
              {s.icon}
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
