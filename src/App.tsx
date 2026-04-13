import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Contact } from './components/Contact';
import { Booking } from './components/Booking';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio, FullGallery } from './components/Portfolio';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { UploadedImage, BookingData, Testimonial, UserRole } from './types';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; category?: string } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [secretTriggerCount, setSecretTriggerCount] = useState(0);
  const secretResetRef = useRef<number | null>(null);

  // Local state
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 'T-001',
      quote: "Gooodmorningggg mother thankyouu sa makeup sobrang ganda talga 🥹🤍, Sana pag ikakasal akoo nag mamakeup kapa wahahaha... Congrats pala mom",
      author: "Sheela Reniedo",
      role: "Client",
      rating: 5,
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg",
      status: 'approved'
    },
    {
      id: 'T-002',
      quote: "Hello sir. Just wanted to thank you for the amazing make up yesterday. Ang fresh tignan. Dami rin po nakaappreciate ng look ko kahapon. Thank you po ulit 🥰",
      author: "Client",
      role: "Private Client",
      rating: 5,
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg",
      status: 'approved'
    },
    {
      id: 'T-003',
      quote: "Ate wil, thank you pati sa anak u very satisfied ang gawa nya pati si dainnielle nagandahan ❤️. Sa Graduation daw ulit pa make up ulit kay kuya von niya 😊 sabi nya saken mama magpabook kana kay kuya von for graduation, Thank you again ate will ❤️",
      author: "Elena Wright",
      role: "Client",
      rating: 5,
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg",
      status: 'approved'
    },
    {
      id: 'T-004',
      quote: "The makeup was absolutely stunning! I felt like a queen on my special day. Can't wait for my next booking!",
      author: "Maria Santos",
      role: "Client",
      rating: 5,
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg",
      status: 'pending'
    }
  ]);
  const [copied, setCopied] = useState(false);

  const isAuthenticated = userRole !== 'guest';

  const handleShare = (src: string) => {
    navigator.clipboard.writeText(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdminSignIn = (email: string) => {
    setUserRole('admin');
    setAdminEmail(email);
    setShowDashboard(true);
    setIsAuthOpen(false);

    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      window.history.replaceState({}, '', '/');
    }
  };

  const handleDashboardRequest = () => {
    setShowDashboard(true);
  };

  const handleLogout = () => {
    setUserRole('guest');
    setAdminEmail(null);
    setShowDashboard(false);
    setIsAuthOpen(false);
    setSecretTriggerCount(0);
    if (secretResetRef.current !== null) {
      window.clearTimeout(secretResetRef.current);
      secretResetRef.current = null;
    }
  };

  const handleHiddenAdminTrigger = () => {
    setSecretTriggerCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAuthOpen(true);
        return 0;
      }
      return next;
    });

    if (secretResetRef.current !== null) {
      window.clearTimeout(secretResetRef.current);
    }
    secretResetRef.current = window.setTimeout(() => {
      setSecretTriggerCount(0);
      secretResetRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/admin') {
      setIsAuthOpen(true);
    }
  }, []);

  if (showDashboard) {
    return (
      <div className="min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white">
        <Navigation
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onAuthRequest={() => setIsAuthOpen(true)}
          onDashboardRequest={handleDashboardRequest}
          userRole={userRole}
          onLogout={handleLogout}
        />

        <Dashboard
          role={userRole}
          email={adminEmail}
          onBack={() => setShowDashboard(false)}
          onLogout={handleLogout}
          bookings={bookings}
          setBookings={setBookings}
          testimonials={testimonials}
          setTestimonials={setTestimonials}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
        />

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSubmit={handleAdminSignIn} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white">
      <Navigation
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onAuthRequest={() => setIsAuthOpen(true)}
        onDashboardRequest={handleDashboardRequest}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSubmit={handleAdminSignIn} />

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
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Services</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Gallery</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Reviews</a>
            <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Reserve</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white transition-colors duration-200 hover:text-luxury-gold">Contact</a>
          </motion.div>
        )}
      </AnimatePresence>

      <Hero />
      <About />
      <Services 
        uploadedImages={uploadedImages} 
        setSelectedImage={setSelectedImage}
      />
      <Portfolio
        setIsGalleryOpen={setIsGalleryOpen}
        setSelectedImage={setSelectedImage}
        uploadedImages={uploadedImages} isAuthenticated={false} userRole={'guest'}      />
      <Testimonials 
        testimonials={testimonials}
        setTestimonials={setTestimonials}
      />
      <Booking />
      <Contact />
      <Footer onHiddenAdminTrigger={handleHiddenAdminTrigger} />

      {/* Full Gallery Modal */}
      <FullGallery 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        setSelectedImage={setSelectedImage}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages} isAuthenticated={false} userRole={'guest'}      />

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
                src={selectedImage.src}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
                alt="Enlarged Portfolio"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-24 left-0 right-0 flex flex-col items-center gap-4">
                {selectedImage.category && (
                  <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] font-medium">
                    {selectedImage.category}
                  </p>
                )}
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setIsGalleryOpen(false);
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="luxury-button py-2! px-6! text-[10px]"
                  >
                    Book This Look
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(selectedImage.src);
                    }}
                    className="px-6 py-2 border border-white/20 rounded-full text-white text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all min-w-25"
                  >
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
