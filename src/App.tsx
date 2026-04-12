import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Contact } from './components/Contact';
import { Booking } from './components/Booking';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { About } from './components/About';
// import { Process } from './components/Process';
import { Services } from './components/Services';
import { Portfolio, FullGallery } from './components/Portfolio';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | null>(null);
  const [userRole, setUserRole] = useState<'guest' | 'client' | 'admin'>('guest');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isAuthenticated = userRole !== 'guest';

  const handleAuthSubmit = (role: 'admin' | 'client', email: string) => {
    setUserRole(role);
    setUserEmail(email);
    setCurrentView('dashboard');
    setAuthModalMode(null);
  };

  const handleLogout = () => {
    setUserRole('guest');
    setUserEmail(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white">
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onAuthRequest={setAuthModalMode}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <AuthModal
        isOpen={!!authModalMode}
        mode={authModalMode ?? 'signin'}
        onClose={() => setAuthModalMode(null)}
        onModeChange={setAuthModalMode}
        onSubmit={handleAuthSubmit}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed inset-0 bg-luxury-ink z-45 flex flex-col items-center justify-center gap-8 text-white text-2xl font-serif italic"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-luxury-gold transition-colors"
            >
              <X size={32} />
            </button>
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Services</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Gallery</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Reviews</a>
            <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Reserve</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold focus:text-luxury-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/40">Contact</a>
            {userRole === 'guest' ? (
              <button
                onClick={() => {
                  setAuthModalMode('signin');
                  setIsMenuOpen(false);
                }}
                className="text-white uppercase tracking-[0.3em] border border-white/20 rounded-full px-5 py-3 hover:border-luxury-gold transition-colors"
              >
                Admin Login
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-white uppercase tracking-[0.3em] border border-white/20 rounded-full px-5 py-3 hover:border-luxury-gold transition-colors"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {currentView === 'dashboard' ? (
        <Dashboard
          role={userRole}
          email={userEmail}
          onBack={() => setCurrentView('home')}
        />
      ) : (
        <>
          <Hero />

          {/* Featured In Section */}
          {/* <section className="py-12 border-b border-luxury-ink/5 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-center text-luxury-ink/40 mb-10">As Featured In</p>
              <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
                <span className="text-2xl md:text-3xl font-serif italic tracking-tighter opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">VOGUE</span>
                <span className="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">BAZAAR</span>
                <span className="text-2xl md:text-3xl font-serif uppercase tracking-widest opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">Elle</span>
                <span className="text-xl md:text-2xl font-serif italic opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">Allure</span>
                <span className="text-2xl md:text-3xl font-serif font-light tracking-tighter opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 cursor-default">GLAMOUR</span>
              </div>
            </div>
          </section> */}

          <About />
          {/* <Process /> */}
          <Services />
          <Portfolio
            setIsGalleryOpen={setIsGalleryOpen}
            setSelectedImage={setSelectedImage}
            isAuthenticated={isAuthenticated}
            userRole={userRole}
          />
          <Testimonials />
          <Booking />
          <Contact />
          <Footer />
        </>
      )}

      {/* Full Gallery Modal */}
      <FullGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        setSelectedImage={setSelectedImage} 
        isAuthenticated={isAuthenticated}
        userRole={userRole}
      />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-110 bg-luxury-ink/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-8 right-8 text-white hover:text-luxury-gold transition-colors z-120"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={40} strokeWidth={1} />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10"
                alt="Enlarged Portfolio"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-white/40 text-[10px] uppercase tracking-[0.5em]">Von</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
