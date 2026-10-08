import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import artistImg from '../assets/img/VonBG.png';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effect for background
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${targetId}`);
    } else {
      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <header 
      ref={containerRef}
      id="home" 
      className="relative min-h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-luxury-ink"
    >
      {/* Background with Parallax */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-ink/60 via-transparent to-luxury-ink z-10" />
        <img 
          src={artistImg}
          className="w-full h-full object-cover brightness-[0.65] contrast-[1.1]"
          alt="Hero Background"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      {/* Floating Particles Atmosphere */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%" 
            }}
            animate={{ 
              opacity: [0, 0.2, 0],
              y: ["-10%", "110%"],
              x: ["-5%", "5%"]
            }}
            transition={{ 
              duration: Math.random() * 10 + 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-luxury-gold rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.03, x: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/4 -left-10 sm:-left-20 text-[30vw] sm:text-[20vw] font-serif italic text-white select-none whitespace-nowrap"
        >
          Artistry
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.03, x: 0 }}
          transition={{ duration: 2, delay: 0.8 }}
          className="absolute bottom-1/4 -right-10 sm:-right-20 text-[30vw] sm:text-[20vw] font-serif italic text-white select-none whitespace-nowrap"
        >
          Confidence
        </motion.div>
      </div>

      <div className="relative z-30 text-center px-6 max-w-5xl my-auto py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="flex items-center justify-center gap-4 mb-2 sm:mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-px bg-luxury-gold/50" 
            />
            <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-luxury-gold font-medium">
              Where beauty meets confidence
            </p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "3rem" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-px bg-luxury-gold/50" 
            />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif italic leading-[0.95] sm:leading-[0.88] text-white">
            <motion.span 
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="block"
            >
              Haus of
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="block text-luxury-gold"
            >
              Von
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-3 sm:mt-4 not-italic font-sans uppercase tracking-[0.2em] font-light opacity-90"
            >
              Beauty
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="relative z-40 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-3 sm:pt-6 pointer-events-auto"
          >
            <a 
              href="#booking" 
              onClick={(e) => handleScrollTo(e, 'booking')}
              className="luxury-button group relative overflow-hidden inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[220px] bg-luxury-gold text-luxury-ink border-luxury-gold hover:text-white cursor-pointer shadow-lg hover:shadow-luxury-gold/20 active:scale-[0.98] transition-all"
            >
              <span className="relative z-10 font-semibold tracking-wider">Book Your Transformation</span>
              <div className="absolute inset-0 bg-luxury-ink translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a 
              href="#portfolio" 
              onClick={(e) => handleScrollTo(e, 'portfolio')}
              className="luxury-button inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[220px] backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-luxury-gold cursor-pointer shadow-lg active:scale-[0.98] transition-all"
            >
              View Portfolio
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust Indicators / Stats - strictly pointer-events-none so it cannot block any button clicks */}
      <div className="absolute bottom-6 md:bottom-8 left-0 w-full z-10 pointer-events-none select-none hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end opacity-40">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">Experience</p>
            <p className="text-sm font-serif italic text-white">Isabela's Premier Artist</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">Transformations</p>
            <p className="text-sm font-serif italic text-white">1000+ Faces Enhanced</p>
          </div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none z-10"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-medium">Scroll to explore</span>
        <div className="relative w-px h-10 sm:h-12 bg-white/10 overflow-hidden">
          <motion.div 
            animate={{ y: [-48, 48] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-luxury-gold to-transparent"
          />
        </div>
      </motion.div>

      {/* Side Label */}
      <div className="absolute left-8 bottom-16 hidden lg:block pointer-events-none select-none z-10">
        <p className="vertical-text text-[10px] tracking-[0.4em] text-white/20 uppercase">
          Cauayan City • Isabela
        </p>
      </div>
    </header>
  );
};
