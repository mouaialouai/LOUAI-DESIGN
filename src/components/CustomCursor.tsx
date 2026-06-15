import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useLanguage } from './LanguageContext';

export default function CustomCursor() {
  const { language } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [visible, setVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring configurations for luxury inertia/smoothness
  const springConfig = { damping: 40, stiffness: 400, mass: 0.4 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const expandable = target.closest('[data-cursor-expand]');
      
      if (expandable) {
        setHovered(true);
        const text = expandable.getAttribute('data-cursor-text') || '';
        setCursorText(text);
      } else {
        setHovered(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Sleek Custom Pointer dot & outer tracking circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-accent/40 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 2.5 : 1,
          backgroundColor: hovered ? 'rgba(156, 131, 96, 0.2)' : 'rgba(156, 131, 96, 0)',
          borderColor: hovered ? 'rgba(156, 131, 96, 1)' : 'rgba(156, 131, 96, 0.4)',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
      >
        {hovered && cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute inset-0 flex items-center justify-center text-[5px] uppercase tracking-widest font-mono text-brand-beige font-semibold ${
              language === 'ar' ? 'font-arabic text-[6px]' : ''
            }`}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-accent rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 0 : 1,
        }}
        transition={{ type: 'tween', duration: 0.15 }}
      />
    </>
  );
}
