import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className={cn('border-2 border-blue-500 border-t-transparent rounded-full animate-spin', sizes[size], className)} />
  );
};

export const PageLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black flex items-center justify-center z-50"
  >
    <div className="text-center space-y-6">
      {/* Logo animation */}
      <motion.div
        className="w-16 h-16 mx-auto relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500" />
        <div className="absolute inset-2 rounded-full bg-blue-500/10 flex items-center justify-center">
          <span className="text-blue-400 font-mono font-bold text-lg">P</span>
        </div>
      </motion.div>

      <motion.div
        className="space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-white/80 font-medium">Loading Portfolio</p>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <div className="skeleton h-48 w-full rounded-xl" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export default LoadingSpinner;
