import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">
        {/* Glitching 404 */}
        <motion.div className="relative mb-8"
          animate={{ textShadow: ['0 0 0 transparent', '2px 0 0 rgba(239,68,68,0.5), -2px 0 0 rgba(37,99,235,0.5)', '0 0 0 transparent'] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}>
          <h1 className="text-[10rem] font-black text-white/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-black gradient-text">404</span>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
        <p className="text-white/40 mb-8 leading-relaxed">
          Looks like this page got lost in the void. Let's get you back on track.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-glow-sm">
              <Home size={18} /> Go Home
            </motion.button>
          </Link>
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:bg-white/5">
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
