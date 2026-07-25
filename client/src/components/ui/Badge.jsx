import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  gray: 'bg-white/5 text-white/60 border-white/10',
};

const Badge = ({ children, variant = 'default', className, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
