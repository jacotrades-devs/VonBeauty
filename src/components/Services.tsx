import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Service1 from '../assets/img/EventCat.png';
import Service2 from '../assets/img/PageantCat.png';
import Service3 from '../assets/img/PhotoShootCat.png';
import Service4 from '../assets/img/WeddingCat.png';

const services = [
  {
    title: "Event Makeup",
    description: "Perfect for birthdays, parties, and special occasions.",
    image: Service1,
    alt: "Professional event makeup artistry",
    tag: "01",
    categories: ["Natural", "Gloss", "Bold", "Shimmer"]
  },
  {
    title: "Pageant Makeup",
    description: "Glam and stage-ready makeup for pageants and competitions.",
    image: Service2,
    alt: "Glamorous pageant competition makeup",
    tag: "02",
    categories: ["Classic Glam", "Modern Glam", "Theatrical", "Avant-Garde"]
  },
  {
    title: "Photoshoot Makeup",
    description: "Professional makeup designed for studio and outdoor photoshoots.",
    image: Service3,
    alt: "Professional photoshoot makeup application",
    tag: "03",
    categories: ["Studio", "Outdoor", "Fashion", "Beauty"]
  },
  {
    title: "Bridal Makeup",
    description: "Elegant and long-lasting makeup for brides and wedding events.",
    image: Service4,
    alt: "Beautiful bridal wedding day makeup",
    tag: "04",
    categories: ["Classic", "Modern", "Romantic", "Ethereal"]
  }
];

export const Services = () => {
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
                {/* aspect-[3/4] gives portrait ratio typical for makeup photos */}
                <div className="aspect-[3/4] w-full">
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-cover
                    
                    "
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
                  className="text-2xl font-serif italic text-luxury-ink mb-3 leading-snug"
                >
                  {s.title}
                </motion.h3>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.28, duration: 0.35 }}
                  className="w-10 h-px bg-luxury-gold mb-4 origin-left"
                />
                <motion.p
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.33 }}
                  className="text-luxury-ink/55 font-light text-sm leading-relaxed mb-5"
                >
                  {s.description}
                </motion.p>
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
                  className="text-4xl xl:text-5xl font-serif italic text-luxury-ink mb-5 leading-tight"
                >
                  {s.title}
                </motion.h3>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.33, duration: 0.4 }}
                  className="w-12 h-px bg-luxury-gold mb-6 origin-left"
                />
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 }}
                  className="text-luxury-ink/60 font-light text-base leading-relaxed mb-8 max-w-sm"
                >
                  {s.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {s.categories.map((cat, idx) => (
                    <button
                      key={idx}
                      className="px-4 py-3 border border-luxury-gold/40 rounded-lg text-luxury-ink text-sm font-light hover:bg-luxury-gold hover:text-white transition-all duration-200 focus:outline-none"
                    >
                      {cat}
                    </button>
                  ))}
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