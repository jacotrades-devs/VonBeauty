import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Mail, Facebook, } from 'lucide-react';
import { RiTiktokLine } from "react-icons/ri";
// @ts-ignore: image import type declaration
import artistImg from '../assets/img/6240061348054240828.jpg';

export const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative order-2 md:order-1"
      >
        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-4/5 max-w-md mx-auto md:max-w-none">
          <img 
            src={artistImg}
            className="w-full h-full object-cover"
            alt="The Artist"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-luxury-gold/10 rounded-full blur-3xl z-0" />
        <div className="absolute -top-6 -left-6 md:-top-12 md:-left-12 w-48 h-48 md:w-64 md:h-64 border border-luxury-gold/20 rounded-full z-0" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-8 md:space-y-10 order-1 md:order-2 text-center md:text-left"
      >
        <div className="space-y-4">
          <p className="text-luxury-gold text-xs tracking-[0.4em] uppercase">The Visionary</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif italic leading-tight">Meet Von</h2>
        </div>
        {/* <p className="text-lg sm:text-xl text-luxury-ink/70 leading-relaxed font-light italic font-serif">
          "Beauty is not about masking; it is about revealing the most sublime version of yourself."
        </p> */}
        <p className="text-base sm:text-lg text-luxury-ink/70 leading-relaxed font-light">
          Hi, I'm Von, a passionate makeup artist who loves enhancing natural beauty while bringing out confidence in every client. I specialize in glam, soft glam, and event makeup for special occasions such as pageants, photoshoots, and celebrations. My goal is to make every client feel beautiful, confident, and camera-ready for their special moments.
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-y-4 gap-x-6 md:gap-8 pt-4">
          <a href="https://www.instagram.com/jv_eugenio?igsh=MWhsZzlqdnV6bDF4NQ%3D%3D&utm_source=qr" className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap">
            <Instagram size={18} className="text-luxury-gold" /> @jv_eugenio
          </a>
          <a href="https://www.facebook.com/share/1Fw38PYQga/?mibextid=wwXIfr" className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap">
            <Facebook size={18} className="text-luxury-gold" /> @Von Eugenio
          </a>
          <a href="https://www.tiktok.com/@jhon_jv_von?_r=1&_t=ZS-95IoqIEc1dl" className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap">
            <RiTiktokLine size={18} className="text-luxury-gold" /> @jhon_jv_von
          </a>
        </div>
      </motion.div>
    </section>
  );
};
