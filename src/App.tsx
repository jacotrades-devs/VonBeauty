import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { useFirebase } from './components/FirebaseProvider';
import { Contact } from './components/Contact';
import { Booking } from './components/Booking';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { About } from './components/About';
import { Services } from './components/Services';
import { Portfolio, FullGallery } from './components/Portfolio';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { StudioSOPModal } from './components/StudioSOPModal';
import { UploadedImage, BookingData, Testimonial, CategoryItem } from './types';

const isAdminRoute = (path: string) => path === '/admin' || path.startsWith('/admin/');

export default function App() {
  const { user, role, isAdmin, loading } = useFirebase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);
  const [pathname, setPathname] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });
  const [selectedImage, setSelectedImage] = useState<{ src: string; category?: string; gender?: string; title?: string } | null>(null);
  
  // Lifted state (synced with Firebase)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [customCategories, setCustomCategories] = useState<CategoryItem[]>([]);

  // Default core categories combined with dynamic admin categories
  const defaultCategories = ['Bridal Makeup', 'Event Makeup', 'Pageant Makeup', 'Photoshoot Makeup', 'Transformation'];
  const categories = useMemo(() => {
    const activeCustom = customCategories
      .filter(c => c.isActive !== false && !c.disabled)
      .map(c => c.name);
    return Array.from(new Set([...defaultCategories, ...activeCustom]));
  }, [customCategories]);

  const navigateToHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
    }
    setPathname('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect unauthenticated visitors attempting protected sub-routes to /admin
  useEffect(() => {
    if (!loading && isAdminRoute(pathname) && (!user || !isAdmin)) {
      if (pathname !== '/admin') {
        window.history.replaceState(null, '', '/admin');
        setPathname('/admin');
      }
    }
  }, [loading, pathname, user, isAdmin]);

  useEffect(() => {
    if (loading) return;

    // --- Firebase Real-time Sync ---
    // 1. Sync Gallery (query collection directly; client handles isHidden filter)
    let unsubscribeGallery = () => {};
    const galleryCol = collection(db, 'gallery');
    try {
      const galleryQuery = query(galleryCol, orderBy('createdAt', 'desc'));
      unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
        const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedImage));
        setUploadedImages(images);
      }, (error) => {
        // Fallback without orderBy in case index or field is missing
        console.warn('Gallery ordered query fallback to unordered:', error);
        unsubscribeGallery = onSnapshot(galleryCol, (snapshot) => {
          const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedImage));
          images.sort((a, b) => {
            const tA = (a.createdAt as any)?.seconds || 0;
            const tB = (b.createdAt as any)?.seconds || 0;
            return tB - tA;
          });
          setUploadedImages(images);
        }, (err2) => {
          handleFirestoreError(err2, OperationType.LIST, 'gallery');
        });
      });
    } catch {
      unsubscribeGallery = onSnapshot(galleryCol, (snapshot) => {
        const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedImage));
        setUploadedImages(images);
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'gallery'));
    }

    // 2. Sync Bookings
    let unsubscribeBookings = () => {};
    if (isAdmin) {
      const bookingsQuery = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookingData));
        setBookings(bks);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      });
    } else if (user?.email) {
      const bookingsQuery = query(collection(db, 'bookings'), where('email', '==', user.email), orderBy('createdAt', 'desc'));
      unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const bks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookingData));
        setBookings(bks);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      });
    } else {
      setBookings([]);
    }

    // 3. Sync Testimonials
    const testimonialsQuery = isAdmin
      ? query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'))
      : query(collection(db, 'testimonials'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));

    const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      setTestimonials(tests);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'testimonials');
    });

    // 4. Sync Custom Categories
    let unsubscribeCategories = () => {};
    const categoriesCol = collection(db, 'categories');
    try {
      const categoriesQuery = query(categoriesCol, orderBy('createdAt', 'desc'));
      unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
        setCustomCategories(cats);
      }, (error) => {
        console.warn('Categories ordered query fallback to unordered:', error);
        unsubscribeCategories = onSnapshot(categoriesCol, (snapshot) => {
          const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
          setCustomCategories(cats);
        }, (err2) => {
          handleFirestoreError(err2, OperationType.LIST, 'categories');
        });
      });
    } catch {
      unsubscribeCategories = onSnapshot(categoriesCol, (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CategoryItem));
        setCustomCategories(cats);
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'categories'));
    }

    return () => {
      unsubscribeGallery();
      unsubscribeBookings();
      unsubscribeTestimonials();
      unsubscribeCategories();
    };
  }, [user, role, isAdmin, loading]);

  const isAuthenticated = !!user;

  const handleLogout = async () => {
    await auth.signOut();
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      window.history.replaceState(null, '', '/admin');
    }
    setPathname('/admin');
  };

  const [copied, setCopied] = useState(false);

  const handleShare = (src: string) => {
    navigator.clipboard.writeText(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onAdminPath = isAdminRoute(pathname);

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white">
      {/* Public Navigation - Completely independent from admin controls */}
      {!onAdminPath && (
        <Navigation
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onOpenSOP={() => setIsSOPModalOpen(true)}
        />
      )}

      {/* Studio SOP Modal */}
      <StudioSOPModal
        isOpen={isSOPModalOpen}
        onClose={() => setIsSOPModalOpen(false)}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {!onAdminPath && isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed inset-0 bg-luxury-ink z-45 flex flex-col items-center justify-center gap-7 text-white text-xl sm:text-2xl font-serif italic"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-white hover:text-luxury-gold transition-colors"
              aria-label="Close menu"
            >
              <X size={32} />
            </button>
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Services</a>
            <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Gallery</a>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                setIsSOPModalOpen(true);
              }}
              className="text-luxury-gold hover:text-white transition-colors cursor-pointer"
            >
              Studio SOP
            </button>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Reviews</a>
            <a href="#booking" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Reserve</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-luxury-gold transition-colors">Contact</a>

            <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/10 w-52">
              <a
                href="#booking"
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-2.5 rounded-full bg-luxury-gold text-luxury-ink font-semibold uppercase tracking-widest text-xs hover:bg-white transition-colors text-center w-full"
              >
                Reserve Look
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Route View vs Public Website View */}
      {onAdminPath ? (
        loading ? (
          <div className="min-h-screen bg-luxury-ink flex flex-col items-center justify-center text-white">
            <div className="w-10 h-10 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Verifying Security Credentials...</p>
          </div>
        ) : !user || !isAdmin ? (
          <AdminLogin
            onSuccess={() => {
              setPathname(window.location.pathname);
            }}
            onBackToSite={navigateToHome}
          />
        ) : (
          <Dashboard
            role="admin"
            email={user?.email || null}
            onBack={navigateToHome}
            onLogout={handleLogout}
            bookings={bookings}
            testimonials={testimonials}
            uploadedImages={uploadedImages}
            categories={categories}
            customCategories={customCategories}
            onOpenSOP={() => setIsSOPModalOpen(true)}
          />
        )
      ) : (
        <>
          <Hero />

          <About />
          <Services 
            uploadedImages={uploadedImages} 
            setSelectedImage={setSelectedImage}
          />
          <Portfolio
            setIsGalleryOpen={setIsGalleryOpen}
            setSelectedImage={setSelectedImage}
            isAuthenticated={isAuthenticated}
            userRole={role}
            uploadedImages={uploadedImages}
            categories={categories}
          />
          <Testimonials 
            testimonials={testimonials} 
          />
          <Booking 
            categories={categories}
            onOpenSOP={() => setIsSOPModalOpen(true)}
          />
          <Contact />
          <Footer 
            onOpenSOP={() => setIsSOPModalOpen(true)}
          />
        </>
      )}

      {/* Full Gallery Modal */}
      <FullGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        setSelectedImage={setSelectedImage} 
        isAuthenticated={isAuthenticated}
        userRole={role}
        uploadedImages={uploadedImages}
        categories={categories}
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
              className="absolute top-8 right-8 text-white hover:text-luxury-gold transition-colors z-120 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={36} strokeWidth={1.5} />
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
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                alt={selectedImage.title || "Enlarged Portfolio"}
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-24 left-0 right-0 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  {selectedImage.category && (
                    <span className="text-luxury-gold text-xs uppercase tracking-[0.3em] font-semibold">
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.gender && (
                    <span className="text-white/60 text-xs uppercase tracking-[0.2em] font-light">
                      • {selectedImage.gender}
                    </span>
                  )}
                </div>
                {selectedImage.title && (
                  <p className="text-white text-sm font-serif italic max-w-md text-center">
                    {selectedImage.title}
                  </p>
                )}
                <div className="flex gap-3 mt-1">
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setIsGalleryOpen(false);
                      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-2 rounded-full bg-luxury-gold text-luxury-ink font-medium text-[10px] uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    Book This Look
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(selectedImage.src);
                    }}
                    className="px-6 py-2 border border-white/20 rounded-full text-white text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all min-w-[100px] cursor-pointer"
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
