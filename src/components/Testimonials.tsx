import React, { useState } from 'react';
import { Star, X, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

export const Testimonials = ({ testimonials, setTestimonials }: TestimonialsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

  const handleReviewSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!reviewAuthor.trim() || !reviewText.trim()) {
      setReviewError('Please enter your name and review.');
      return;
    }

    const newReview: Testimonial = {
      id: `T-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      quote: reviewText.trim(),
      author: reviewAuthor.trim(),
      role: 'Client',
      rating: reviewRating,
      image: 'https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg',
      status: 'pending' // New reviews are pending by default
    };

    setTestimonials([newReview, ...testimonials]);
    setReviewAuthor('');
    setReviewText('');
    setReviewRating(5);
    setReviewSuccess('Thank you! Your review has been submitted for approval.');
    
    // Close modal after a short delay on success
    setTimeout(() => {
      setIsModalOpen(false);
      setReviewSuccess('');
    }, 3000);
  };

  return (
    <section id="testimonials" className="py-32 bg-white overflow-hidden">
      <div className="text-center mb-24 px-6">
        <Star className="text-luxury-gold mx-auto mb-6" size={32} fill="currentColor" />
        <h2 className="text-5xl font-serif italic">Trusted by Clients</h2>
      </div>

      <div className="relative overflow-hidden">
        {approvedTestimonials.length > 0 ? (
          <div className="marquee-track gap-8 px-4">
            {[...approvedTestimonials, ...approvedTestimonials].map((t, i) => (
              <div 
                key={i}
                className="w-[300px] sm:w-[400px] md:w-[450px] bg-luxury-cream/30 p-6 sm:p-10 rounded-3xl border border-luxury-ink/5 flex flex-col justify-between"
              >
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-luxury-gold/20">
                      <img 
                        src={t.image} 
                        className="w-full h-full object-cover" 
                        alt={t.author}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-luxury-ink">{t.author}</p>
                      <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-luxury-gold mt-1">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-serif italic leading-relaxed text-luxury-ink/80">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={10}
                        className={index < (t.rating ?? 5) ? 'text-luxury-gold' : 'text-luxury-ink/20'}
                        fill={index < (t.rating ?? 5) ? 'currentColor' : 'none'}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-luxury-ink/40 italic">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
        
      <div className="mt-16 text-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="portfolio-button group inline-flex items-center gap-3"
        >
          <MessageSquarePlus size={18} />
          Leave a Review
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 flex items-center justify-center p-6 bg-luxury-ink/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-luxury-cream rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-luxury-ink/40 hover:text-luxury-ink transition-colors cursor-pointer z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 sm:p-12">
                <div className="mb-10">
                  <p className="text-xs uppercase tracking-[0.35em] text-luxury-gold mb-2">Share your experience</p>
                  <h3 className="text-4xl font-serif italic">Write a Review</h3>
                  <p className="text-sm text-luxury-ink/60 mt-4">
                    Your feedback helps us maintain the highest standards of beauty and service. 
                    Reviews are moderated before being published.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="grid gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-ink/50 ml-1">Your Rating</label>
                    <div className="flex items-center gap-3">
                      {Array.from({ length: 5 }, (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setReviewRating(index + 1)}
                          className="cursor-pointer transition-transform hover:scale-110"
                          aria-label={`${index + 1} star${index + 1 === 1 ? '' : 's'}`}
                        >
                          <Star
                            size={28}
                            className={index < reviewRating ? 'text-luxury-gold' : 'text-luxury-ink/10'}
                            fill={index < reviewRating ? 'currentColor' : 'none'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-ink/50 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={reviewAuthor}
                      onChange={(event) => setReviewAuthor(event.target.value)}
                      className="luxury-input"
                      placeholder="e.g. Maria Santos"
                    />
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-ink/50 ml-1">Your Story</label>
                    <textarea
                      value={reviewText}
                      onChange={(event) => setReviewText(event.target.value)}
                      className="luxury-input min-h-[120px] resize-none"
                      placeholder="Tell us about your transformation..."
                    />
                  </div>

                  {reviewError && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-red-500 font-medium"
                    >
                      {reviewError}
                    </motion.p>
                  )}
                  
                  {reviewSuccess && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-green-600 font-serif italic text-center py-2 bg-green-50 rounded-xl"
                    >
                      {reviewSuccess}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="luxury-button w-full py-5 text-sm"
                  >
                    Submit for Approval
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Gradient Overlays for smooth fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};
