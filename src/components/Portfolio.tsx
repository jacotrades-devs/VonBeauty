import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Upload, Plus, Trash2, ImagePlus } from 'lucide-react';
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

interface UploadedImage {
  id: string;
  src: string;
  file: File;
}

interface PortfolioProps {
  setIsGalleryOpen: (isOpen: boolean) => void;
  setSelectedImage: (img: string | null) => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'admin';
}

export const Portfolio = ({ setIsGalleryOpen, setSelectedImage, isAuthenticated, userRole }: PortfolioProps) => {
  const portfolio = [image1, image2, image3];

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-5xl font-serif italic">The Gallery</h2>
          {!isAuthenticated && (
            <p className="mt-4 max-w-xl text-sm text-luxury-ink/60">
              Uploads are reserved for admin users only. Sign in as admin to add photos to the gallery.
            </p>
          )}
          {userRole === 'client' && (
            <p className="mt-4 max-w-xl text-sm text-luxury-ink/60">
              As a client, you can view the gallery but uploads are restricted to admins only.
            </p>
          )}
        </div>
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="group flex items-center gap-3 text-xs tracking-widest uppercase hover:text-luxury-gold transition-colors whitespace-nowrap cursor-pointer"
        >
          View All Work <ArrowRight size={14} />
        </button>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
        {portfolio.map((img, i) => (
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
}

export const FullGallery = ({ isOpen, onClose, setSelectedImage, isAuthenticated, userRole }: FullGalleryProps) => {
  const staticImages = [
    image1, image2, image3, image4,
    image5, image6, image7, image8,
    image9, image10, image11,
  ];

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allImages: string[] = [
    ...staticImages,
    ...uploadedImages.map((u) => u.src),
  ];

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE_MB = 10;

  const processFiles = useCallback((files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    const valid: UploadedImage[] = [];
    let errorMsg: string | null = null;

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errorMsg = `"${file.name}" is not a supported format. Use JPG, PNG, WEBP, or GIF.`;
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errorMsg = `"${file.name}" exceeds ${MAX_SIZE_MB}MB. Please compress it first.`;
        continue;
      }
      const src = URL.createObjectURL(file);
      valid.push({ id: crypto.randomUUID(), src, file });
    }

    if (errorMsg) setUploadError(errorMsg);
    if (valid.length > 0) {
      setUploadedImages((prev) => [...prev, ...valid]);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
              <button
                onClick={() => userRole === 'admin' && setIsUploadOpen(true)}
                disabled={userRole !== 'admin'}
                className={`portfolio-button ${userRole !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Add Photos
              </button>
              {userRole !== 'admin' && (
                <p className="text-xs text-luxury-ink/50 uppercase tracking-[0.3em] mt-1 sm:mt-0">
                  Admin access required to upload images.
                </p>
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
              {allImages.map((img, i) => {
                const isUploaded = i >= staticImages.length;
                const uploadedEntry = isUploaded
                  ? uploadedImages[i - staticImages.length]
                  : null;

                return (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    className="break-inside-avoid mb-8 overflow-hidden rounded-xl group relative border border-luxury-ink/5 cursor-zoom-in"
                  >
                    <img
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={`Portfolio image ${i + 1}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-luxury-ink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Delete button for uploaded images */}
                    {isUploaded && uploadedEntry && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploaded(uploadedEntry.id);
                        }}
                        className="absolute top-2 right-2 bg-luxury-ink/70 hover:bg-luxury-ink text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* "New" badge for uploaded */}
                    {isUploaded && (
                      <span className="absolute top-2 left-2 bg-luxury-gold/90 text-xs text-white tracking-widest uppercase px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">
                        New
                      </span>
                    )}
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => userRole === 'admin' && setIsUploadOpen(true)}
                className={`break-inside-avoid mb-8 rounded-xl border-2 border-dashed transition-colors duration-300 flex flex-col items-center justify-center min-h-[160px] gap-3 group ${userRole === 'admin' ? 'border-luxury-ink/20 hover:border-luxury-gold/60 cursor-pointer' : 'border-luxury-ink/10 bg-luxury-ink/5 cursor-not-allowed opacity-60'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${userRole === 'admin' ? 'bg-luxury-ink/5 group-hover:bg-luxury-gold/10' : 'bg-luxury-ink/20'}`}>
                  <Plus size={20} className={`transition-colors duration-300 ${userRole === 'admin' ? 'text-luxury-ink/40 group-hover:text-luxury-gold' : 'text-luxury-ink/30'}`} />
                </div>
                <span className="text-xs tracking-widest uppercase transition-colors duration-300">
                  {userRole === 'admin' ? 'Add Photos' : 'Admin only'}
                </span>
              </motion.div>
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
                  {/* Modal header */}
                  <div className="flex justify-between items-center px-8 pt-8 pb-4">
                    <div>
                      <h3 className="text-2xl font-serif italic">Add to Collection</h3>
                      <p className="text-xs tracking-widest uppercase text-luxury-ink/40 mt-1">
                        JPG · PNG · WEBP · GIF · up to 10MB
                      </p>
                    </div>
                    <button
                      onClick={() => setIsUploadOpen(false)}
                      className="text-luxury-ink/40 hover:text-luxury-ink transition-colors cursor-pointer"
                    >
                      <X/>
                    </button>
                  </div>

                  {/* Drop zone */}
                  <div className="px-8 pb-4">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
                        flex flex-col items-center justify-center gap-4 py-12
                        ${isDragging
                          ? 'border-luxury-gold bg-luxury-gold/5 scale-[1.02]'
                          : 'border-luxury-ink/15 hover:border-luxury-gold/50 hover:bg-luxury-ink/[0.02]'
                        }
                      `}
                    >
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
                        ${isDragging ? 'bg-luxury-gold/15' : 'bg-luxury-ink/5'}
                      `}>
                        <Upload
                          size={22}
                          className={`transition-colors duration-300 ${isDragging ? 'text-luxury-gold' : 'text-luxury-ink/30'}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-luxury-ink/70">
                          {isDragging ? 'Release to upload' : 'Drag & drop your photos here'}
                        </p>
                        <p className="text-xs text-luxury-ink/40 mt-1">or click to browse files</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleFileInput}
                      />
                    </div>

                    {/* Error message */}
                    {uploadError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-3 text-center"
                      >
                        {uploadError}
                      </motion.p>
                    )}
                  </div>

                  {/* Uploaded previews in modal */}
                  {uploadedImages.length > 0 && (
                    <div className="px-8 pb-6">
                      <p className="text-xs tracking-widest uppercase text-luxury-ink/40 mb-3">
                        Added ({uploadedImages.length})
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {uploadedImages.map((u) => (
                          <div key={u.id} className="relative group">
                            <img
                              src={u.src}
                              alt={u.file.name}
                              className="w-16 h-16 object-cover rounded-lg border border-luxury-ink/10"
                            />
                            <button
                              onClick={() => removeUploaded(u.id)}
                              className="absolute -top-1.5 -right-1.5 bg-luxury-ink text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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