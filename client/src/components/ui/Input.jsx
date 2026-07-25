import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  label,
  error,
  icon,
  className,
  containerClassName,
  textarea,
  rows = 4,
  ...props
}, ref) => {
  const baseClass = cn(
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white',
    'placeholder-white/30 focus:outline-none focus:border-blue-500/70 focus:bg-white/8',
    'transition-all duration-200',
    error && 'border-red-500/50 focus:border-red-500',
    icon && 'pl-11',
    className
  );

  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </span>
        )}
        {textarea ? (
          <textarea ref={ref} rows={rows} className={cn(baseClass, 'resize-none')} {...props} />
        ) : (
          <input ref={ref} className={baseClass} {...props} />
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
