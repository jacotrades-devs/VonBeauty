import React from 'react';
import { motion } from 'motion/react';
import { Menu, X, User } from 'lucide-react';

interface NavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  onOpenSOP?: () => void;
}

export const Navigation = ({ isMenuOpen, setIsMenuOpen, onOpenSOP }: NavigationProps) => {
  return (
    <>
      <nav className="fixed w-full z-40 px-6 py-8 flex items-center justify-between mix-blend-difference text-white">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-serif tracking-widest uppercase"
        >
          Von
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-10 text-xs tracking-[0.3em] uppercase" aria-label="Primary navigation">
            <a href="#home" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Home</a>
            <a href="#about" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">About</a>
            <a href="#services" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Services</a>
            <a href="#gallery" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Gallery</a>
            {onOpenSOP && (
              <button 
                onClick={onOpenSOP}
                className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none cursor-pointer uppercase"
              >
                Studio SOP
              </button>
            )}
            <a href="#booking" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Booking</a>
            <a href="#contact" className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#booking"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-luxury-ink bg-luxury-gold hover:bg-white transition-colors cursor-pointer font-medium rounded-full px-5 py-2 shadow-sm"
            >
              Reserve Look
            </a>
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden z-50"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className="fixed z-[100]">
        {/* AnimatePresence is handled in App.tsx for the wrapper, or we can move it here if we import it */}
      </div>
    </>
  );
};
