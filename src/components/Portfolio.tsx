import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Upload, Plus, Trash2, ImagePlus, ChevronDown } from 'lucide-react';
import { UploadedImage, ServiceCategory } from '../types';
import { ImageUploadForm } from './ImageUploadForm';
import image1 from '../assets/img/album/6240061348054240837.jpg';
import image2 from '../assets/img/album/6240061348054240838.jpg';
import image3 from '../assets/img/album/6240061348054240839.jpg';
import image4 from '../assets/img/album/6240061348054240840.jpg';
import image5 from '../assets/img/album/6240061348054240841.jpg';
import image6 from '../assets/img/album/6240061348054240842.jpg';
import image7 from '../assets/img/album/6240061348054240843.jpg';
import image8 from '../assets/img/album/6240061348054240844.jpg';
import image9 from '../assets/img/album/6240061348054240845.jpg';
import image10 from '../assets/img/album/6240061348054240846.jpg';
import image11 from '../assets/img/album/6240061348054240847.jpg';

interface PortfolioProps {
  setIsGalleryOpen: (isOpen: boolean) => void;
  setSelectedImage: (img: string | null) => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'admin';
  uploadedImages: UploadedImage[];
}

export const Portfolio = ({ setIsGalleryOpen, setSelectedImage, isAuthenticated, userRole, uploadedImages }: PortfolioProps) => {
  const staticPortfolio = [image1, image2, image3];
  // Show a mix of static and uploaded if available
  const displayPortfolio = [...staticPortfolio, ...uploadedImages.slice(0, 3).map(img => img.src)].slice(0, 3);

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-5xl font-serif italic">The Gallery</h2>
        </div>
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="group flex items-center gap-3 text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap cursor-pointer"
        >
          View All Work <ArrowRight size={14} />
        </button>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
        {displayPortfolio.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedImage(img)}
            className="break-inside-avoid mb-4 md:mb-8 overflow-hidden rounded-xl cursor-zoom-in group"
          >
            <img
              src={img}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              alt={`Haus of Von Beauty portfolio makeup showcase ${i + 1}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

interface FullGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedImage: (img: string | null) => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'admin';
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export const FullGallery = ({ isOpen, onClose, setSelectedImage, isAuthenticated, userRole, uploadedImages, setUploadedImages }: FullGalleryProps) => {
  const staticImages = [
    image1, image2, image3, image4,
    image5, image6, image7, image8,
    image9, image10, image11,
  ];

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const allImages: { src: string; category?: string; isUploaded: boolean; id?: string }[] = [
    ...staticImages.map(src => ({ src, isUploaded: false })),
    ...uploadedImages.map((u) => ({ src: u.src, category: u.category, isUploaded: true, id: u.id })),
  ];

  const removeUploaded = (id: string) => {
    setUploadedImages((prev) => {
      const removed = prev.find((u) => u.id === id);
      if (removed) URL.revokeObjectURL(removed.src);
      return prev.filter((u) => u.id !== id);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-luxury-cream overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 p-8 flex justify-between items-center bg-luxury-cream/80 backdrop-blur-md border-b border-luxury-ink/5">
            <h2 className="text-3xl font-serif italic">The Complete Collection</h2>
            <div className="flex items-center gap-6">
              {userRole === 'admin' && (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="portfolio-button"
                >
                  Add Photos
                </button>
              )}
              <button 
                onClick={onClose}
                className=" text-luxury-ink/50 hover:text-luxury-gold transition-colors cursor-pointer"
              >
                <X/>
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto p-8 md:p-16">
            <div className="columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
              {allImages.map((imgObj, i) => {
                return (
                  <motion.div
                    key={imgObj.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    className="break-inside-avoid mb-8 overflow-hidden rounded-xl group relative border border-luxury-ink/5 cursor-zoom-in"
                  >
                    <img
                      src={imgObj.src}
                      onClick={() => setSelectedImage(imgObj.src)}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={`Portfolio image ${i + 1}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-luxury-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Overlay */}
                    {imgObj.category && (
                      <div className="absolute bottom-2 left-2 bg-luxury-ink/60 backdrop-blur-sm text-[8px] text-white uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {imgObj.category}
                      </div>
                    )}

                    {/* Delete button for uploaded images */}
                    {imgObj.isUploaded && imgObj.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploaded(imgObj.id!);
                        }}
                        className="absolute top-2 right-2 bg-luxury-ink/70 hover:bg-luxury-ink text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* "New" badge for uploaded */}
                    {imgObj.isUploaded && (
                      <span className="absolute top-2 left-2 bg-luxury-gold/90 text-xs text-white tracking-widest uppercase px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                        New
                      </span>
                    )}
                  </motion.div>
                );
              })}

              {userRole === 'admin' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIsUploadOpen(true)}
                  className="break-inside-avoid mb-8 rounded-xl border-2 border-dashed transition-colors duration-300 flex flex-col items-center justify-center min-h-[160px] gap-3 group border-luxury-ink/20 hover:border-luxury-gold/60 cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-luxury-ink/5 group-hover:bg-luxury-gold/10">
                    <Plus size={20} className="transition-colors duration-300 text-luxury-ink/40 group-hover:text-luxury-gold" />
                  </div>
                  <span className="text-xs tracking-widest uppercase transition-colors duration-300">
                    Add Photos
                  </span>
                </motion.div>
              )}
            </div>

            <div className="mt-24 text-center pb-16">
              <p className="font-serif italic text-2xl mb-8">Ready for your own transformation?</p>
              <button
                onClick={() => {
                  onClose();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="portfolio-button group inline-flex items-center gap-3"
              >
                Contact Me
              </button>
            </div>
          </div>

          {/* Upload Modal */}
          <AnimatePresence>
            {isUploadOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-110 flex items-center justify-center p-6"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsUploadOpen(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 16 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="bg-luxury-cream rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                >
                  {/* Shared Upload Form */}
                  <div className="px-8 pb-8">
                    <ImageUploadForm
                      uploadedImages={uploadedImages}
                      onUpload={(newImages) => setUploadedImages(prev => [...prev, ...newImages])}
                      onRemove={removeUploaded}
                    />
                  </div>

                  {/* Modal footer */}
                  <div className="px-8 pb-8 flex justify-end gap-3">
                    <button
                      onClick={() => setIsUploadOpen(false)}
                      className="portfolio-button portfolio-button--secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsUploadOpen(false)}
                      disabled={uploadedImages.length === 0}
                      className="portfolio-button"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
