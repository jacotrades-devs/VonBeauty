import React from 'react';
import { MapPin, Phone, Mail, Calendar, Clock, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { RiTiktokLine } from 'react-icons/ri';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-luxury-ink text-white/60 py-24 px-6 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-serif italic text-white mb-4">Haus of Von Beauty</h3>
              <p className="font-light max-w-sm leading-relaxed text-sm sm:text-base">
                Elevating natural beauty through bespoke artistry. Based in Cauayan City, dedicated to creating timeless looks for your most precious moments.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[
                { icon: <Instagram size={18} />, href: "https://www.instagram.com/jv_eugenio?igsh=MWhsZzlqdnV6bDF4NQ%3D%3D&utm_source=qr", label: "Instagram" },
                { icon: <Facebook size={18} />, href: "https://www.facebook.com/share/1Fw38PYQga/?mibextid=wwXIfr", label: "Facebook" },
                { icon: <RiTiktokLine size={18} />, href: "https://www.tiktok.com/@jhon_jv_von?_r=1&_t=ZS-95IoqIEc1dl", label: "TikTok" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-luxury-gold hover:border-luxury-gold hover:text-luxury-ink transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-semibold text-luxury-gold">Explore</h4>
            <ul className="space-y-4 text-xs sm:text-sm">
              {['Home', 'About', 'Services', 'Gallery', 'Booking'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-semibold text-luxury-gold">Contact</h4>
              <div className="space-y-4 text-xs sm:text-sm">
                <p className="flex items-start gap-3 leading-relaxed">
                  <MapPin size={16} className="text-luxury-gold shrink-0 mt-0.5" />
                  <span>Roxas st. District 2<br/>Cauayan City, Isabela</span>
                </p>
                <div className="space-y-2">
                  <a href="tel:+09667316921" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Phone size={14} className="text-luxury-gold" /> Globe +09667316921
                  </a>
                  <a href="tel:+09358530343" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Phone size={14} className="text-luxury-gold" /> TM +09358530343
                  </a>
                  <a href="tel:+09947860153" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Phone size={14} className="text-luxury-gold" /> DITO +09947860153
                  </a>
                  <a href="mailto:eugeniojv31@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Mail size={14} className="text-luxury-gold" /> eugeniojv31@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-semibold text-luxury-gold">Studio Hours</h4>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-luxury-gold" />
                  <p>Tue - Sat: 10am - 7pm</p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-luxury-gold" />
                  <p>Sun - Mon: By Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[10px] uppercase tracking-[0.2em]">
            <p>&copy; 2026 Haus of Von Beauty. All Rights Reserved.</p>
            {/* <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div> */}
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-gold transition-colors"
          >
            Back to top
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-luxury-gold transition-all">
              <ArrowUp size={12} />
            </div>
          </button>
        </div>
      </div>

      {/* Subtle signature background */}
      <div className="absolute -bottom-10 -right-10 text-[15vw] font-serif italic text-white/[0.02] select-none pointer-events-none">
        Von
      </div>
    </footer>
  );
};
