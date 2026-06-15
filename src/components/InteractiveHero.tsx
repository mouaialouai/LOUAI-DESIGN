import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { useLanguage } from './LanguageContext';
import { ArrowDown, Layers, ShieldCheck, Sparkles, PenTool, Palette } from 'lucide-react';

export default function InteractiveHero() {
  const { t, language, dir } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Motion values for realistic 3D mouse tracking tilt on the abstract geometric image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs to smoothen the rotation tracking
  const springConfig = { damping: 30, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  
  // Floating offset for subtle constant breathing interaction
  const translateY = useSpring(useTransform(mouseY, [-300, 300], [-10, 10]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden px-4 sm:px-8 py-20 bg-grid-overlay font-sans"
      id="hero-section"
    >
      {/* Dynamic ambient highlights in background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-[120px] pointer-events-none" />

      {/* Full layout columns */}
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Text column - responsive alignments */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left rtl:lg:text-right">
          
          <div className="flex justify-center lg:justify-start rtl:lg:justify-start items-center gap-2 mb-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_10px_rgba(156,131,96,0.8)]"
            />
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-xs uppercase tracking-[0.25em] font-mono text-brand-accent font-medium ${
                language === 'ar' ? 'font-arabic text-sm tracking-normal' : ''
              }`}
            >
              {t.heroSubtitle}
            </motion.span>
          </div>

          <div className="overflow-hidden mb-2">
            <motion.h1 
              key={`h1-row1-${language}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`text-4xl md:text-6xl xl:text-7xl font-extrabold tracking-tight text-white ${
                language === 'ar' ? 'font-arabic leading-tight' : 'font-display'
              }`}
            >
              {t.heroTitleRow1}
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.h1 
              key={`h1-row2-${language}`}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-widest text-brand-accent ${
                language === 'ar' ? 'font-arabic leading-snug tracking-normal' : 'font-display text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-beige'
              }`}
            >
              {t.heroTitleRow2}
            </motion.h1>
          </div>

          <motion.p 
            key={`p-desc-${language}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-brand-beige/70 max-w-xl mx-auto lg:mx-0 text-sm md:text-base leading-relaxed mb-10 ${
              language === 'ar' ? 'font-arabic ml-auto mr-0' : ''
            }`}
          >
            {t.heroDesc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center lg:justify-start rtl:lg:justify-start gap-4 items-center"
          >
            <a 
              href="#contact-section"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-dark hover:bg-white text-xs sm:text-sm tracking-widest uppercase font-mono font-bold rounded-none border border-brand-accent hover:border-white transition-all duration-300 transform shadow-lg"
              data-cursor-expand="true"
              data-cursor-text={language === 'en' ? 'GO' : 'اذهب'}
              id="cta-hero-contact"
            >
              <span>{t.heroCTA}</span>
              <Sparkles size={16} className="animate-pulse" />
            </a>

            <a 
              href="#portfolio-section"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-brand-accent hover:bg-brand-accent/5 text-xs sm:text-sm tracking-widest uppercase font-mono font-semibold rounded-none transition-all duration-300"
              data-cursor-expand="true"
              data-cursor-text={language === 'en' ? 'WORKS' : 'أعمال'}
              id="cta-hero-portfolio"
            >
              <span>{t.heroSecondaryCTA}</span>
            </a>
          </motion.div>
        </div>

        {/* 3D abstract graphic visualizer column */}
        <div className="lg:col-span-5 flex justify-center items-center relative min-h-[400px] sm:min-h-[500px]">
          
          {/* Circular vector geometry backing */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border border-white/5 flex items-center justify-center pointer-events-none">
            <div className="w-[240px] h-[240px] rounded-full border border-white/10 border-dashed animate-spin" style={{ animationDuration: '60s' }} />
          </div>

          {/* Aesthetic Faint Orbit Pathways */}
          {[
            isMobile ? 125 : 175,
            isMobile ? 155 : 230,
            isMobile ? 180 : 265,
            isMobile ? 200 : 290
          ].map((radius, idx) => (
            <div 
              key={`orbit-path-${idx}`}
              className="absolute rounded-full border border-brand-accent/[0.03] sm:border-brand-accent/[0.04] pointer-events-none"
              style={{
                width: radius * 2,
                height: radius * 2,
              }}
            />
          ))}

          {/* Floating dynamic design orbiting icons and Adobe software tags */}
          {[
            {
              id: 'adobe-ps',
              type: 'text',
              content: 'Ps',
              name: 'Photoshop',
              radius: isMobile ? 125 : 175,
              duration: 35,
              clockwise: true,
              initialAngle: 0,
            },
            {
              id: 'adobe-ai',
              type: 'text',
              content: 'Ai',
              name: 'Illustrator',
              radius: isMobile ? 155 : 230,
              duration: 48,
              clockwise: false,
              initialAngle: 120,
            },
            {
              id: 'adobe-ae',
              type: 'text',
              content: 'Ae',
              name: 'After Effects',
              radius: isMobile ? 180 : 265,
              duration: 40,
              clockwise: true,
              initialAngle: 240,
            },
            {
              id: 'tool-pentool',
              type: 'icon',
              content: <PenTool size={13} className="text-brand-accent group-hover/orbit:text-white transition-colors duration-300" />,
              name: language === 'en' ? 'Bezier Pen Tool' : 'أداة بن تول',
              radius: isMobile ? 200 : 290,
              duration: 55,
              clockwise: false,
              initialAngle: 60,
            },
            {
              id: 'tool-palette',
              type: 'icon',
              content: <Palette size={13} className="text-brand-accent group-hover/orbit:text-white transition-colors duration-300" />,
              name: language === 'en' ? 'Color Palette' : 'لوحة الألوان',
              radius: isMobile ? 125 : 175,
              duration: 25,
              clockwise: true,
              initialAngle: 180,
            }
          ].map((orbit) => (
            <motion.div
              key={orbit.id}
              className="absolute pointer-events-none flex items-center justify-center z-20"
              animate={{ rotate: [orbit.initialAngle, orbit.initialAngle + (orbit.clockwise ? 360 : -360)] }}
              transition={{ repeat: Infinity, duration: orbit.duration, ease: "linear" }}
            >
              <motion.div
                style={{ x: orbit.radius }}
                animate={{ rotate: [-orbit.initialAngle, -orbit.initialAngle - (orbit.clockwise ? 360 : -360)] }}
                transition={{ repeat: Infinity, duration: orbit.duration, ease: "linear" }}
                className="pointer-events-auto group/orbit relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-brand-dark/95 backdrop-blur-md border border-brand-accent/25 hover:border-brand-accent hover:shadow-[0_0_15px_rgba(156,131,96,0.3)] transition-all duration-300 rounded-sm cursor-pointer select-none"
              >
                {/* Micro reflection / soft glow aura */}
                <div className="absolute inset-0 bg-brand-accent/[0.04] opacity-0 group-hover/orbit:opacity-100 blur-sm rounded-sm transition-opacity duration-300" />
                
                {orbit.type === 'text' ? (
                  <span className="text-[10px] sm:text-xs font-mono font-black text-brand-accent tracking-wider group-hover/orbit:text-white transition-colors duration-300">
                    {orbit.content}
                  </span>
                ) : (
                  orbit.content
                )}

                {/* Aesthetic minimal Adobe square accent strip on top */}
                {orbit.type === 'text' && (
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-brand-accent/40 group-hover/orbit:bg-brand-accent transition-colors duration-300" />
                )}

                {/* Floating micro-tooltip */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 scale-95 group-hover/orbit:opacity-100 group-hover/orbit:scale-100 transition-all duration-300 pointer-events-none text-[8px] sm:text-[9px] font-mono tracking-widest text-[#9c8360] bg-brand-dark/95 border border-[#9c8360]/20 px-2 py-0.5 whitespace-nowrap z-40 shadow-xl">
                  {orbit.name}
                </div>
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            style={{
              rotateX,
              rotateY,
              x: translateX,
              y: translateY,
              transformStyle: 'preserve-3d',
              perspective: 1000
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-72 h-96 sm:w-80 sm:h-[420px] relative rounded-none overflow-hidden border border-white/10 bg-brand-surface shadow-2xl group cursor-pointer z-10"
            data-cursor-expand="true"
            data-cursor-text={language === 'en' ? 'ROTATE' : 'تدوير'}
            id="hero-3d-showcase-box"
          >
            {/* The high-end luxury generated image asset */}
            <img 
              src="/src/assets/images/regenerated_image_1781296623314.webp" 
              alt="Louai Mouaia Abstract Art Asset"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-750"
            />

            {/* Industrial frame details */}
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-brand-accent">
                <span>IDENTITY.RAW</span>
                <span className="text-white/40">v1.2 // PROTOCOL</span>
              </div>
              <h4 className="text-sm font-sans font-semibold tracking-wider text-white mt-1 uppercase">
                {language === 'en' ? 'Institutional Architecture' : 'هندسة بصرية تنظيمية'}
              </h4>
            </div>

            <div className="absolute top-4 left-4 p-2 bg-brand-dark/80 backdrop-blur-md border border-white/5 text-[9px] font-mono tracking-widest text-brand-beige">
              L. MOUAIA // 2026
            </div>
            
            <div className="absolute top-4 right-4 p-2 bg-brand-accent text-brand-dark text-[9px] font-mono font-bold tracking-widest">
              STUDIO
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating coordinates indicator at margins for premium feel */}
      <div className="absolute bottom-6 left-8 hidden lg:flex items-center gap-3 text-[10px] font-mono text-brand-muted/50 select-none">
        <span>XCOORD // {mouseX.get().toFixed(0)}</span>
        <span className="h-3 w-[1px] bg-white/15" />
        <span>YCOORD // {mouseY.get().toFixed(0)}</span>
      </div>

      <div className="absolute bottom-6 right-8 hidden lg:flex items-center gap-3 text-[10px] font-mono text-brand-muted/50 select-none">
        <ArrowDown size={12} className="animate-bounce" />
        <span className="uppercase tracking-widest">{language === 'en' ? 'SCROLL PROTOCOL' : 'المتابعة لأسفل'}</span>
      </div>
    </section>
  );
}
