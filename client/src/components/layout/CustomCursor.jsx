import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Smooth spring following
  const springX = useSpring(cursorX, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15, mass: 0.1 });
  const dotSpringX = useSpring(dotX, { stiffness: 800, damping: 28 });
  const dotSpringY = useSpring(dotY, { stiffness: 800, damping: 28 });

  const glowRef = useRef(null);
  const isHovering = useRef(false);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      dotX.set(e.clientX - 4);
      dotY.set(e.clientY - 4);

      // Glow effect follows mouse
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        isHovering.current = true;
      }
    };

    const handleMouseOut = () => { isHovering.current = false; };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY, dotX, dotY]);

  return (
    <>
      {/* Cursor glow that follows mouse */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed z-[9998] w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
          transition: 'left 0.05s, top 0.05s',
        }}
      />

      {/* Ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] w-10 h-10 rounded-full border border-blue-500/50 mix-blend-difference"
        style={{ x: springX, y: springY }}
      />

      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] w-2 h-2 rounded-full bg-blue-500"
        style={{ x: dotSpringX, y: dotSpringY }}
      />
    </>
  );
};

export default CustomCursor;
