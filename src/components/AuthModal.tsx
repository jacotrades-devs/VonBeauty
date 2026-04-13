import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onSubmit }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock authentication for demo purposes
    // In a real app, this would verify credentials against a backend
    if (email === 'admin@vonbeauty.com' && password === 'Admin123!') {
      onSubmit(email);
      setEmail('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-luxury-ink/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-luxury-ink/40 hover:text-luxury-gold transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-luxury-gold/10 text-luxury-gold mb-4">
                  <Lock size={32} />
                </div>
                <h2 className="text-2xl font-serif italic text-luxury-ink">Admin Access</h2>
                <p className="text-luxury-ink/60 text-sm mt-2">Enter your credentials to access the dashboard</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-ink/40 mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-ink/20" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-luxury-cream/30 border border-luxury-ink/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold/30 transition-all"
                      placeholder="admin@vonbeauty.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-luxury-ink/40 mb-2 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-ink/20" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-luxury-cream/30 border border-luxury-ink/5 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold/30 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                {error && (
                  <p className="text-red-500 text-xs text-center font-medium">{error}</p>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-luxury-ink text-white py-4 rounded-xl font-serif italic text-lg hover:bg-luxury-gold transition-all duration-500 shadow-lg shadow-luxury-ink/10"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-luxury-ink/5 text-center">
                <p className="text-luxury-ink/40 text-[10px] uppercase tracking-widest">
                  Haus of Von Beauty &copy; 2026
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
