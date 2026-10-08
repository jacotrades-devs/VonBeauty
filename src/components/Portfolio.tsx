
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Sparkles, Users } from 'lucide-react';
import { UploadedImage, GenderTag } from '../types';
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
  setSelectedImage: (img: { src: string; category?: string; gender?: string; title?: string } | null) => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'admin';
  uploadedImages: UploadedImage[];
  categories?: string[];
}

export const Portfolio = ({ 
  setIsGalleryOpen, 
  setSelectedImage, 
  uploadedImages,
  categories = ['Bridal Makeup', 'Event Makeup', 'Pageant Makeup', 'Photoshoot Makeup', 'Transformation']
}: PortfolioProps) => {
  const [selectedGender, setSelectedGender] = useState<'All' | GenderTag>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const staticPortfolio: { src: string; category: string; gender: GenderTag; title: string }[] = [
    { src: image1, category: 'Event Makeup', gender: 'Female', title: 'High Glam Event' },
    { src: image2, category: 'Pageant Makeup', gender: 'Female', title: 'Coronation Pageant' },
    { src: image3, category: 'Photoshoot Makeup', gender: 'Female', title: 'High-Fashion Editorial' },
    { src: image4, category: 'Bridal Makeup', gender: 'Female', title: 'Classic Radiant Bride' },
    { src: image5, category: 'Event Makeup', gender: 'Female', title: 'Groom & Executive Prep' },
    { src: image6, category: 'Transformation', gender: 'Female', title: 'Sculpted Glamour' }
  ];

  const visibleUploaded = uploadedImages.filter(img => !img.isHidden);

  const allItems = [
    ...visibleUploaded.map(u => ({
      src: u.src,
      category: u.category,
      gender: u.gender || 'Female',
      title: u.title || u.category
    })),
    ...staticPortfolio
  ];

  const filteredItems = allItems.filter(item => {
    const matchGender = selectedGender === 'All' || item.gender === selectedGender;
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchGender && matchCategory;
  });

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-[0.3em] font-medium">
            <Sparkles size={14} /> Bespoke Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-luxury-ink">The Gallery</h2>
          <p className="text-xs text-luxury-ink/50 max-w-md font-light">
            Explore curated artistry categorized by service style and tailored for women, men, and gender-inclusive creative looks.
          </p>
        </div>

        <button
          onClick={() => setIsGalleryOpen(true)}
          className="group inline-flex items-center gap-3 text-xs tracking-widest uppercase text-luxury-ink hover:text-luxury-gold transition-colors whitespace-nowrap cursor-pointer self-start md:self-auto border-b border-luxury-ink/20 pb-1"
        >
          View Complete Collection ({allItems.length}) <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Filter Tabs: Gender & Categories */}
      <div className="space-y-4 mb-10">
        {/* Gender Demographics Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mr-2 flex items-center gap-1.5">
            <Users size={12} /> Demographic:
          </span>
          {(['All', 'Female', 'Male', 'Gender-Inclusive'] as const).map((g) => {
            const labelMap = {
              'All': 'All Profiles',
              'Female': 'Women / Female',
              'Male': 'Men / Male',
              'Gender-Inclusive': 'Gender-Inclusive / Queer'
            };
            const isSelected = selectedGender === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-luxury-ink text-white shadow-sm'
                    : 'bg-white text-luxury-ink/60 hover:text-luxury-ink border border-luxury-ink/10'
                }`}
              >
                {labelMap[g]}
              </button>
            );
          })}
        </div>

        {/* Category Styles Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-luxury-ink/40 font-semibold mr-2">
            Style:
          </span>
          {['All', ...categories].map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-[9px] uppercase tracking-widest transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-luxury-gold text-white shadow-sm'
                    : 'bg-white/70 text-luxury-ink/50 hover:text-luxury-ink border border-luxury-ink/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry Columns */}
      {filteredItems.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredItems.slice(0, 6).map((imgObj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(imgObj)}
              className="break-inside-avoid overflow-hidden rounded-2xl cursor-zoom-in group relative border border-luxury-ink/10 bg-white shadow-sm"
            >
              <img
                src={imgObj.src}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                alt={imgObj.title}
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold mb-1">
                  {imgObj.category} • {imgObj.gender}
                </span>
                <h4 className="text-sm font-serif italic">{imgObj.title}</h4>
              </div>

              {/* Minimal permanent corner pill */}
              <div className="absolute bottom-3 left-3 bg-luxury-ink/75 backdrop-blur-md text-[8px] text-white uppercase tracking-widest px-2.5 py-1 rounded-full group-hover:opacity-0 transition-opacity">
                {imgObj.category}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 rounded-3xl border border-dashed border-luxury-ink/20">
          <p className="text-sm font-serif italic text-luxury-ink/60">No photos found matching this demographic or category combination.</p>
          <button 
            onClick={() => { setSelectedGender('All'); setSelectedCategory('All'); }}
            className="mt-3 text-xs uppercase tracking-widest text-luxury-gold hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

interface FullGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedImage: (img: { src: string; category?: string; gender?: string; title?: string } | null) => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'admin';
  uploadedImages: UploadedImage[];
  categories?: string[];
}

export const FullGallery = ({ 
  isOpen, 
  onClose, 
  setSelectedImage, 
  uploadedImages,
  categories = ['Bridal Makeup', 'Event Makeup', 'Pageant Makeup', 'Photoshoot Makeup', 'Transformation']
}: FullGalleryProps) => {
  const [selectedGender, setSelectedGender] = useState<'All' | GenderTag>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const staticImages: { src: string; category: string; gender: GenderTag; title: string }[] = [
    { src: image1, category: 'Event Makeup', gender: 'Female', title: 'Grand Gala Glam' },
    { src: image2, category: 'Pageant Makeup', gender: 'Female', title: 'Pageant Evening Gown' },
    { src: image3, category: 'Photoshoot Makeup', gender: 'Gender-Inclusive', title: 'Fashion Campaign' },
    { src: image4, category: 'Bridal Makeup', gender: 'Female', title: 'Bespoke Bridal Radiance' },
    { src: image5, category: 'Event Makeup', gender: 'Male', title: 'Groom Natural Grooming' },
    { src: image6, category: 'Pageant Makeup', gender: 'Female', title: 'National Swimsuit Segment' },
    { src: image7, category: 'Photoshoot Makeup', gender: 'Female', title: 'Studio High-Contrast' },
    { src: image8, category: 'Bridal Makeup', gender: 'Female', title: 'Reception Glam Bride' },
    { src: image9, category: 'Event Makeup', gender: 'Gender-Inclusive', title: 'Red Carpet Dramatic Look' },
    { src: image10, category: 'Pageant Makeup', gender: 'Female', title: 'Preliminary Crown Contender' },
    { src: image11, category: 'Photoshoot Makeup', gender: 'Male', title: 'Editorial Male Portfolio' },
  ];

  const visibleUploaded = uploadedImages.filter(u => !u.isHidden);

  const allImages = [
    ...visibleUploaded.map(u => ({
      id: u.id,
      src: u.src,
      category: u.category,
      gender: u.gender || 'Female',
      title: u.title || `${u.category} Look`,
      isUploaded: true
    })),
    ...staticImages.map((s, idx) => ({
      id: `static-${idx}`,
      src: s.src,
      category: s.category,
      gender: s.gender,
      title: s.title,
      isUploaded: false
    }))
  ];

  const filteredImages = allImages.filter(img => {
    const matchGender = selectedGender === 'All' || img.gender === selectedGender;
    const matchCategory = selectedCategory === 'All' || img.category === selectedCategory;
    return matchGender && matchCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-luxury-cream overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 px-6 sm:px-10 py-6 flex justify-between items-center bg-luxury-cream/90 backdrop-blur-md border-b border-luxury-ink/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-medium">Haus of Von Archive</span>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-luxury-ink">The Complete Collection</h2>
            </div>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-luxury-ink/15 flex items-center justify-center text-luxury-ink/60 hover:text-luxury-ink hover:border-luxury-gold hover:bg-white transition-all cursor-pointer"
              aria-label="Close Gallery"
            >
              <X size={18} />
            </button>
          </div>

          {/* Gallery Content */}
          <div className="max-w-7xl mx-auto p-6 sm:p-10 md:p-16 space-y-10">
            {/* Dual Filter Header */}
            <div className="bg-white/80 p-6 rounded-3xl border border-luxury-ink/10 space-y-4 shadow-sm">
              {/* Gender Demographic Selector */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold mr-2 flex items-center gap-1.5">
                  <Users size={14} /> Demographic / Gender:
                </span>
                {(['All', 'Female', 'Male', 'Gender-Inclusive'] as const).map((g) => {
                  const labels = {
                    'All': 'All Profiles',
                    'Female': 'Women / Female',
                    'Male': 'Men / Male',
                    'Gender-Inclusive': 'Gender-Inclusive / LGBTQ+'
                  };
                  const isSelected = selectedGender === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer font-medium ${
                        isSelected
                          ? 'bg-luxury-ink text-white shadow-md'
                          : 'bg-luxury-cream/50 text-luxury-ink/60 hover:text-luxury-ink border border-luxury-ink/10'
                      }`}
                    >
                      {labels[g]}
                    </button>
                  );
                })}
              </div>

              {/* Style Category Selector */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-luxury-ink/5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-ink/40 font-bold mr-2">
                  Service Category:
                </span>
                {['All', ...categories].map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-luxury-gold text-white shadow-sm'
                          : 'bg-white text-luxury-ink/50 hover:text-luxury-ink border border-luxury-ink/10'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photos Count Bar */}
            <div className="flex items-center justify-between text-xs text-luxury-ink/50 px-2 font-light">
              <span>Showing {filteredImages.length} bespoke looks</span>
              <span>Click any image to expand</span>
            </div>

            {/* Gallery Grid */}
            {filteredImages.length > 0 ? (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {filteredImages.map((imgObj, i) => (
                  <motion.div
                    key={imgObj.id || i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="break-inside-avoid overflow-hidden rounded-2xl group relative border border-luxury-ink/10 bg-white cursor-zoom-in shadow-sm"
                    onClick={() => setSelectedImage(imgObj)}
                  >
                    <img
                      src={imgObj.src}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={imgObj.title}
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">
                        {imgObj.category} • {imgObj.gender}
                      </span>
                      <h4 className="text-sm font-serif italic mt-0.5">{imgObj.title}</h4>
                    </div>

                    <div className="absolute bottom-2 left-2 bg-luxury-ink/75 backdrop-blur-md text-[8px] text-white uppercase tracking-widest px-2.5 py-1 rounded-full group-hover:opacity-0 transition-opacity">
                      {imgObj.category}
                    </div>

                    {imgObj.isUploaded && (
                      <span className="absolute top-2 left-2 bg-luxury-gold text-[9px] text-white tracking-widest uppercase px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                        Studio New
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/70 rounded-3xl border border-dashed border-luxury-ink/20">
                <p className="font-serif italic text-xl text-luxury-ink/60 mb-2">No looks found in this filter.</p>
                <p className="text-xs text-luxury-ink/40 mb-4">Try choosing "All Profiles" or another service category.</p>
                <button
                  onClick={() => { setSelectedGender('All'); setSelectedCategory('All'); }}
                  className="px-6 py-2 rounded-full bg-luxury-ink text-white text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Bottom Call to Action */}
            <div className="text-center pt-16 pb-12 border-t border-luxury-ink/10 space-y-4">
              <p className="font-serif italic text-2xl sm:text-3xl text-luxury-ink">
                Ready to create your own signature look?
              </p>
              <button
                onClick={() => {
                  onClose();
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 rounded-full bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink transition-colors text-xs uppercase tracking-[0.25em] font-medium cursor-pointer shadow-lg"
              >
                Book Your Session
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
