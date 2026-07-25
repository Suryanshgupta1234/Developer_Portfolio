import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle, align = 'center', tag }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
  >
    {tag && (
      <div className={`mb-4 ${align === 'center' ? 'flex justify-center' : ''}`}>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
          {tag}
        </span>
      </div>
    )}
    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
      {title}
    </h2>
    <div className={`w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 ${align === 'center' ? 'mx-auto' : ''}`} />
    {subtitle && (
      <p className={`text-white/50 text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
