import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Instagram, Facebook, Phone, Send } from 'lucide-react';
import artistImg from '../assets/img/a8007abc-0198-4f43-8b81-0ee0f8af98a0.jpg';
import emailjs from '@emailjs/browser';
import { Toaster, toast } from 'react-hot-toast';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      time: new Date().toLocaleString(),
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setLoading(false);
        setFormData({ name: '', email: '', message: '' });
        toast.success('Message sent successfully!');
      },
      (error) => {
        setLoading(false);
        console.error(error);
        toast.error('Failed to send message. Please try again.');
      }
    );
  };

  return (
    <section id="contact" className="py-16 sm:py-24 lg:py-32 bg-luxury-ink text-white relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} /> {}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-10 pointer-events-none">
        <img src={artistImg} className="w-full h-full object-cover" alt="Artist" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Side: Info & Icons */}
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-4 lg:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white">Get In <span className="text-luxury-gold">Touch</span></h2>
              <p className="text-white/60 font-light tracking-wide max-w-md leading-relaxed text-sm sm:text-base">
                Ready to elevate your beauty experience? Whether it's for a Event, Pagent, Photoshoot, or a Bridal, I'm here to bring your vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:gap-8">
              <motion.a 
                whileHover={{ x: 10 }}
                href="mailto:eugeniojv31@gmail.com"
                className="group flex items-center gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all">
                  <Mail size={18} className="group-hover:text-luxury-ink" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40">Email</p>
                  <p className="text-xs sm:text-sm font-light">eugeniojv31@gmail.com</p>
                </div>
              </motion.a>

              <div className="group flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all">
                  <Phone size={18} className="group-hover:text-luxury-ink" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40">Phone</p>
                  <div className="space-y-1">
                    <a href="tel:+09667316921" className="block text-xs sm:text-sm font-light hover:text-luxury-gold transition-colors">Globe +09667316921</a>
                    <a href="tel:+09358530343" className="block text-xs sm:text-sm font-light hover:text-luxury-gold transition-colors">TM +09358530343</a>
                    <a href="tel:+09947860153" className="block text-xs sm:text-sm font-light hover:text-luxury-gold transition-colors">DITO +09947860153</a>
                  </div>
                </div>
              </div>

              {/* <motion.a 
                whileHover={{ x: 10 }}
                href="https://instagram.com/vonluxe"
                target="_blank"
                className="group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all">
                  <Instagram size={20} className="group-hover:text-luxury-ink" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Instagram</p>
                  <p className="text-sm font-light">@vonluxe</p>
                </div>
              </motion.a>

              <motion.a 
                whileHover={{ x: 10 }}
                href="https://facebook.com/vonluxe"
                target="_blank"
                className="group flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all">
                  <Facebook size={20} className="group-hover:text-luxury-ink" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Facebook</p>
                  <p className="text-sm font-light">Von Luxe Artistry</p>
                </div>
              </motion.a> */}
            </div>
          </div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-3xl border border-white/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 py-2 sm:py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors font-light text-sm sm:text-base"
                  placeholder="Evelyn Vane"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Gmail Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 py-2 sm:py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors font-light text-sm sm:text-base"
                  placeholder="evelyn@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-luxury-gold">Message</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-white/20 py-2 sm:py-3 text-white focus:outline-none focus:border-luxury-gold transition-colors font-light resize-none text-sm sm:text-base"
                  placeholder="Tell me about your vision..."
                />
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full luxury-button !bg-luxury-gold !text-luxury-ink hover:!bg-white flex items-center justify-center gap-3 group py-3 sm:py-4"
              >
                {loading ? 'Sending...' : 'Send Message'} <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
