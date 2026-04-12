import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  onClose: () => void;
  onModeChange: (mode: 'signin' | 'signup') => void;
  onSubmit: (role: 'admin' | 'client', email: string) => void;
}

export const AuthModal = ({ isOpen, mode, onClose, onModeChange, onSubmit }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';
  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (isSignup) return password === confirmPassword && confirmPassword.trim().length > 0;
    return true;
  }, [email, password, confirmPassword, isSignup]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Please complete all fields.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (mode === 'signin') {
      if (normalizedEmail === 'admin@vonbeauty.com' && password === 'Admin123!') {
        onSubmit('admin', normalizedEmail);
      } else {
        setError('Access denied. Only admin login is allowed.');
        return;
      }
    } else {
      onSubmit('client', normalizedEmail);
    }

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] bg-luxury-ink/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-luxury-ink/10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-luxury-ink/40">Welcome back</p>
            <h2 className="text-3xl font-serif mt-2">{isSignup ? 'Create an account' : 'Sign in'}</h2>
          </div>
          <button onClick={onClose} className="text-luxury-ink/50 hover:text-luxury-ink transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 px-8 pt-6">
          <button
            className="flex-1 rounded-full px-4 py-3 text-sm uppercase tracking-[0.35em] bg-luxury-ink text-white"
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 grid gap-6">
          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.25em] text-luxury-ink/60">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="luxury-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs uppercase tracking-[0.25em] text-luxury-ink/60">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="luxury-input"
              placeholder="Enter your password"
            />
          </div>

          {isSignup && (
            <div className="grid gap-2">
              <label className="text-xs uppercase tracking-[0.25em] text-luxury-ink/60">Confirm password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="luxury-input"
                placeholder="Repeat your password"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="luxury-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignup ? 'Create account' : 'Continue'}
          </button>

          {!isSignup && (
            <p className="text-sm text-luxury-ink/60">
              Admin login only. Please enter your admin credentials.
            </p>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};
