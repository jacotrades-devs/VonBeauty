import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowLeft, ShieldAlert, Sparkles, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { AUTHORIZED_ADMIN_EMAILS } from './FirebaseProvider';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyAndProceed = async (userEmail: string | null | undefined) => {
    if (!userEmail) {
      await signOut(auth);
      throw new Error('Access denied. No email associated with this account.');
    }

    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(userEmail.toLowerCase());
    if (!isAuthorized) {
      await signOut(auth);
      throw new Error('Access denied. This account is not authorized as the website administrator.');
    }

    onSuccess();
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await verifyAndProceed(cred.user.email);
    } catch (err: any) {
      console.warn('Sign-in error (handled):', err.code || err.message);
      if (err.message && err.message.includes('Access denied')) {
        setError(err.message);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid credentials. Please verify your administrator email and password.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password sign-in is not enabled in Firebase Console. Please use Google Sign-In or enable Email/Password provider.');
      } else {
        setError('Unable to authenticate. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await verifyAndProceed(cred.user.email);
    } catch (err: any) {
      console.warn('Google sign-in error (handled):', err.code || err.message);
      if (err.message && err.message.includes('Access denied')) {
        setError(err.message);
      } else if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled popup - no error message needed
      } else {
        setError('Authentication failed. Please verify that your Google account is authorized.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-ink flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-luxury-gold selection:text-white">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back to site link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-white/50 hover:text-luxury-gold text-xs uppercase tracking-[0.25em] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={14} /> Return to Public Website
        </button>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 mx-auto flex items-center justify-center text-luxury-gold mb-4 shadow-inner">
              <Lock size={22} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold font-semibold block">
              Restricted Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif italic text-white mt-1">
              Studio Administration
            </h1>
            <p className="text-xs text-white/50 mt-2 font-light">
              Authorized website owner authentication required to access management controls.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-200 text-xs leading-relaxed"
            >
              <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2 font-medium">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vonbeauty.com"
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all font-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/60 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all font-light"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-luxury-gold text-luxury-ink font-semibold text-xs uppercase tracking-[0.25em] hover:bg-white transition-all shadow-lg hover:shadow-luxury-gold/20 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              <LogIn size={15} />
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/40">
              <span className="bg-luxury-ink px-3">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/30 text-white text-xs font-medium transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 1.8 14.7 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.6 2.8C6.4 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.5 14.1c-.2-.7-.4-1.4-.4-2.1s.2-1.4.4-2.1L1.9 7.1C.7 9.5 0 12.2 0 15s.7 5.5 1.9 7.9l3.6-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.2-6.5-5.1L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            Sign In with Google (ju27ine@gmail.com)
          </button>

          <p className="text-[10px] text-white/30 text-center mt-6 uppercase tracking-widest">
            Protected by Firebase Authentication & Security Rules
          </p>
        </motion.div>
      </div>
    </div>
  );
};
