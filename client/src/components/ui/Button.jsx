import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-glow-sm hover:shadow-glow',
  ghost: 'border border-white/20 hover:border-white/40 hover:bg-white/5 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  success: 'bg-green-600 hover:bg-green-500 text-white',
  glass: 'glass hover:bg-white/10 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-9 py-4 text-lg',
  icon: 'p-2',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon,
  iconRight,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
