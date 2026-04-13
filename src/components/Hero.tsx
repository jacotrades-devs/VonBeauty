import React from 'react';
import { motion } from 'motion/react';
import artistImg from '../assets/img/VonBG.png';

export const Hero = () => {
  return (
    <header id="home" className="relative h-screen overflow-hidden flex items-center justify-center bg-luxury-ink">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <img 
          src={artistImg}
          className="w-full h-full object-cover brightness-75"
          alt="Hero Background"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      <div className="relative z-10 text-center px-4">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xs tracking-[0.5em] uppercase mb-6 text-luxury-gold"
        >
          Where beauty meets confidence
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif italic mb-12 leading-tight text-white"
        >
          Haus of <br className="hidden sm:block" />
          <span className="text-luxury-gold">Von</span> Beauty
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#booking" className="luxury-button inline-block min-w-[200px] bg-luxury-gold text-luxury-ink border-luxury-gold hover:bg-transparent hover:text-luxury-gold">
            Book Now
          </a>
          <a href="#contact" className="luxury-button inline-block min-w-[200px]">
            Contact Me
          </a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-px h-16 bg-linear-to-b from-white/50 to-transparent mx-auto" />
      </motion.div>
    </header>
  );
};
