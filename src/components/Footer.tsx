import React from 'react';
import { MapPin, Phone, Mail, Calendar, Clock, Instagram, Facebook } from 'lucide-react';
import { RiTiktokLine } from 'react-icons/ri';

export const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-luxury-ink/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="sm:col-span-2">
          <h3 className="text-3xl font-serif italic mb-6">Haus of Von Beauty</h3>
          <p className="text-luxury-ink/50 font-light max-w-sm leading-relaxed">
            Where beauty meets confidence.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold">Follow</h4>
          <div className="flex flex-col gap-3 text-sm text-luxury-ink/70">
            <a href="https://www.instagram.com/jv_eugenio?igsh=MWhsZzlqdnV6bDF4NQ%3D%3D&utm_source=qr" className="flex items-center gap-2 hover:text-luxury-gold transition-colors">
              <Instagram size={16} /> @jv_eugenio
            </a>
            <a href="https://www.facebook.com/share/1Fw38PYQga/?mibextid=wwXIfr" className="flex items-center gap-2 hover:text-luxury-gold transition-colors">
              <Facebook size={16} /> @Von Eugenio
            </a>
            <a href="https://www.tiktok.com/@jhon_jv_von?_r=1&_t=ZS-95IoqIEc1dl" className="flex items-center gap-2 hover:text-luxury-gold transition-colors">
              <RiTiktokLine size={16} /> @jhon_jv_von
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold">Contact</h4>
          <div className="space-y-2 text-sm text-luxury-ink/70">
            <p className="flex items-center gap-2"><MapPin size={14} /> Roxas st. District 2 | Cauayan City | Isabela</p>
            <p className="flex items-center gap-2"><Phone size={14} /> <a href="tel:+09667316921" className="block text-sm font-light hover:text-luxury-gold transition-colors">Globe +09667316921</a></p>
            <p className="flex items-center gap-2"><Phone size={14} /> <a href="tel:+09358530343" className="block text-sm font-light hover:text-luxury-gold transition-colors">TM +09358530343</a></p>
            <p className="flex items-center gap-2"><Phone size={14} /> <a href="tel:+09947860153" className="block text-sm font-light hover:text-luxury-gold transition-colors">DITO +09947860153</a></p>
            <p className="flex items-center gap-2"><Mail size={14} /> <a href="mailto:eugeniojv31@gmail.com" className="block text-sm font-light hover:text-luxury-gold transition-colors">eugeniojv31@gmail.com</a></p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold">Studio Hours</h4>
          <div className="space-y-2 text-sm text-luxury-ink/70">
            <p className="flex items-center gap-2"><Clock size={14} /> Tue - Sat: 10am - 7pm</p>
            <p className="flex items-center gap-2"><Calendar size={14} /> Sun - Mon: By Appointment</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-luxury-ink/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-luxury-ink/40">
        <p className="text-center md:text-left">&copy; 2026 Von. All Rights Reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-luxury-gold">Privacy Policy</a>
          <a href="#" className="hover:text-luxury-gold">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
