import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadedImage } from '../types';
import Service1 from '../assets/img/EventCat.png';
import Service2 from '../assets/img/PageantCat.png';
import Service3 from '../assets/img/PhotoShootCat.png';
import Service4 from '../assets/img/WeddingCat.png';

const services = [
  {
    title: "Event Makeup",
    description: "Perfect for birthdays, parties, and special occasions where you want to stand out with a polished, professional look.",
    image: Service1,
    alt: "Professional event makeup artistry",
    tag: "01",
    price: "₱1,500",
    categories: ["Natural", "Gloss", "Bold", "Shimmer"],
    features: ["Skin Prep & Priming", "Custom Lash Application", "Long-wear Setting", "Touch-up Kit Included"]
  },
  {
    title: "Pageant Makeup",
    description: "Glam and stage-ready makeup designed to enhance your features under intense lighting and high-definition cameras.",
    image: Service2,
    alt: "Glamorous pageant competition makeup",
    tag: "02",
    price: "₱2,500",
    categories: ["Classic Glam", "Modern Glam", "Theatrical", "Avant-Garde"],
    features: ["Contouring for Stage", "High-Definition Finish", "Waterproof Formula", "Stage Presence Consultation"]
  },
  {
    title: "Photoshoot Makeup",
    description: "Professional makeup designed specifically for studio and outdoor photography, ensuring a flawless finish in every frame.",
    image: Service3,
    alt: "Professional photoshoot makeup application",
    tag: "03",
    price: "₱2,000",
    categories: ["Studio", "Outdoor", "Fashion", "Beauty"],
    features: ["Camera-Ready Finish", "On-set Touch-ups", "Lighting Adjustment", "Creative Direction Support"]
  },
  {
    title: "Bridal Makeup",
    description: "Elegant, timeless, and long-lasting makeup for brides. We focus on creating a look that reflects your personal style.",
    image: Service4,
    alt: "Beautiful bridal wedding day makeup",
    tag: "04",
    price: "₱5,000",
    categories: ["Classic", "Modern", "Romantic", "Ethereal"],
    features: ["Bridal Consultation", "Trial Session Available", "Premium Skincare Prep", "Bridal Party Packages"]
  }
];

interface ServicesProps {
  uploadedImages: UploadedImage[];
  setSelectedImage: (img: { src: string; category?: string } | null) => void;
}

export const Services = ({ uploadedImages, setSelectedImage }: ServicesProps) => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const prev = () => goTo((active - 1 + services.length) % services.length);
  const next = () => goTo((active + 1) % services.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const s = services[active];
  
  // Filter uploaded images by the current service title and visibility
  const filteredImages = uploadedImages.filter(img => img.category === s.title && !img.isHidden);

  return (
    <section
      id="services"
      className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic mb-4">Bespoke Services</h2>
          <div className="w-20 h-px bg-luxury-gold mx-auto" />
        </div>

        {/* Tab pills */}
        <div className="flex justify-center gap-1.5 mb-8 flex-wrap">
          {services.map((svc, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`px-4 py-1.5 rounded-full text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-all duration-300 focus:outline-none font-sans ${
                i === active
                  ? 'bg-luxury-gold text-white shadow-sm'
                  : 'text-luxury-ink/40 hover:text-luxury-ink border border-luxury-gold/25 hover:border-luxury-gold/50'
              }`}
            >
              {svc.tag} — {svc.title}
            </button>
          ))}
        </div>

        {/* Slider */}
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
          >

            {/* ── MOBILE layout: image on top (full, uncropped), info below ── */}
            <div className="lg:hidden flex flex-col gap-4">

              {/* Image — uses aspect ratio so full photo always shows */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-[#f0ebe4]">
                <div className="aspect-[3/4] w-full">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span
                  className="absolute top-3 left-4 font-serif italic text-white/40 text-4xl leading-none select-none pointer-events-none"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}
                >
                  {s.tag}
                </span>
              </div>

              {/* Info card */}
              <div className="bg-[#faf8f5] rounded-2xl px-6 py-7">
                <motion.p
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-luxury-gold tracking-[0.22em] text-[10px] uppercase font-sans mb-2"
                >
                  Service {s.tag}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="text-2xl font-serif italic text-luxury-ink mb-1 leading-snug"
                >
                  {s.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-luxury-gold font-serif italic text-lg mb-3"
                >
                  Starting at {s.price}
                </motion.p>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.28, duration: 0.35 }}
                  className="w-10 h-px bg-luxury-gold mb-4 origin-left"
                />
                <motion.p
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.33 }}
                  className="text-luxury-ink/55 font-light text-sm leading-relaxed mb-6"
                >
                  {s.description}
                </motion.p>

                {/* Features List (Mobile) */}
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 mb-6"
                >
                  {s.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-luxury-ink/70">
                      <div className="w-1 h-1 rounded-full bg-luxury-gold" />
                      {feature}
                    </div>
                  ))}
                </motion.div>
                
                {/* Recent Work Gallery (Mobile) */}
                {filteredImages.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-luxury-gold mb-3">Recent Work</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {filteredImages.map((img) => (
                        <div 
                          key={img.id} 
                          className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-luxury-ink/5 cursor-zoom-in"
                          onClick={() => setSelectedImage({ src: img.src, category: img.category })}
                        >
                          <img src={img.src} alt="Recent work" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {s.categories.map((cat, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-2.5 border border-luxury-gold/35 rounded-lg text-luxury-ink text-xs font-light hover:bg-luxury-gold hover:text-white transition-all duration-200 focus:outline-none"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ── DESKTOP layout: side by side ── */}
            <div className="hidden lg:grid lg:grid-cols-2 rounded-3xl overflow-hidden" style={{ minHeight: '560px' }}>
              <div className="relative bg-[#f0ebe4] flex items-center justify-center overflow-hidden">
                <img
                  src={s.image}
                  alt={s.alt}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span
                  className="absolute top-6 left-7 font-serif italic text-white/40 text-6xl leading-none select-none"
                  style={{ textShadow: '0 2px 20px rgba(0,0,0,0.22)' }}
                >
                  {s.tag}
                </span>
              </div>

              <div className="bg-[#faf8f5] flex flex-col justify-center px-14 py-16">
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-luxury-gold tracking-[0.25em] text-xs uppercase font-sans mb-4"
                >
                  Service {s.tag}
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                  className="text-4xl xl:text-5xl font-serif italic text-luxury-ink mb-2 leading-tight"
                >
                  {s.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-luxury-gold font-serif italic text-2xl mb-5"
                >
                  Starting at {s.price}
                </motion.p>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.33, duration: 0.4 }}
                  className="w-12 h-px bg-luxury-gold mb-6 origin-left"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  className="text-luxury-ink/60 font-light text-base leading-relaxed mb-6 max-w-sm"
                >
                  {s.description}
                </motion.p>

                {/* Features List (Desktop) */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 }}
                  className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8"
                >
                  {s.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-luxury-ink/70 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold/40 group-hover:bg-luxury-gold transition-colors" />
                      {feature}
                    </div>
                  ))}
                </motion.div>

                {/* Recent Work Gallery (Desktop) */}
                {filteredImages.length > 0 && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-4">Recent Work</p>
                    <div className="grid grid-cols-4 gap-3">
                      {filteredImages.slice(0, 4).map((img) => (
                        <div 
                          key={img.id} 
                          className="aspect-square rounded-xl overflow-hidden border border-luxury-ink/5 group relative cursor-zoom-in"
                          onClick={() => setSelectedImage({ src: img.src, category: img.category })}
                        >
                          <img src={img.src} alt="Recent work" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {s.categories.map((cat, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-3 border border-luxury-gold/40 rounded-lg text-luxury-ink text-sm font-light hover:bg-luxury-gold hover:text-white transition-all duration-200 focus:outline-none"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                    className="luxury-button w-full flex items-center justify-center gap-3 group"
                  >
                    Book {s.title}
                    <div className="w-5 h-px bg-white/40 group-hover:w-8 transition-all duration-300" />
                  </button>
                </motion.div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6 px-1">
          <div className="flex gap-2 items-center">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 focus:outline-none ${
                  i === active ? 'w-7 h-2 bg-luxury-gold' : 'w-2 h-2 bg-luxury-gold/25 hover:bg-luxury-gold/55'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="w-12 h-12 rounded-full border-2 border-luxury-gold bg-luxury-gold/5 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="w-12 h-12 rounded-full border-2 border-luxury-gold bg-luxury-gold/5 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
