import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({
  children,
  className,
  hover = true,
  glow = false,
  animate = false,
  delay = 0,
  ...props
}) => {
  const cardContent = (
    <div
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-glow-sm cursor-pointer',
        glow && 'shadow-glow border-blue-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

export default Card;
