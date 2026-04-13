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

  return (
    <header 
      ref={containerRef}
      id="home" 
      className="relative h-screen h-[100dvh] overflow-hidden flex items-center justify-center bg-luxury-ink"
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

      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
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

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-serif italic leading-[0.9] sm:leading-[0.85] text-white">
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
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mt-4 not-italic font-sans uppercase tracking-[0.2em] font-light opacity-90"
            >
              Beauty
            </motion.span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-8 z-50"
          >
            <a 
              href="#booking" 
              className="luxury-button group relative overflow-hidden inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[220px] bg-luxury-gold text-luxury-ink border-luxury-gold hover:text-white z-50 transition-all duration-300"
            >
              <span className="relative z-10">Book Your Transformation</span>
              <div className="absolute inset-0 bg-luxury-ink translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a 
              href="#contact" 
              className="luxury-button inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[220px] backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 z-50 transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Trust Indicators / Stats */}
      <div className="absolute bottom-24 left-0 w-full z-0 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end opacity-40">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-luxury-gold">Experience</p>
            <p className="text-sm font-serif italic text-white">Isabela's Artist</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] uppercase tracking-widest text-luxury-gold">Transformations</p>
            <p className="text-sm font-serif italic text-white">1000+ Clients</p>
          </div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-medium">Scroll to explore</span>
        <div className="relative w-px h-16 bg-white/10 overflow-hidden">
          <motion.div 
            animate={{ y: [-64, 64] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-luxury-gold to-transparent"
          />
        </div>
      </motion.div>

      {/* Side Label */}
      <div className="absolute left-8 bottom-24 hidden lg:block">
        <p className="vertical-text text-[10px] tracking-[0.4em] text-white/20 uppercase">
          Cauayan City • Isabela
        </p>
      </div>
    </header>
  );
};
