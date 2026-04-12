import React, { useEffect, useState } from 'react';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
}

export const Login = ({ isOpen, onClose, onAuthenticate }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitted(true);
    console.log('Login submitted:', { email, password, remember });
    onAuthenticate();
    setTimeout(() => onClose(), 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-white/85 backdrop-blur-3xl flex items-center justify-center p-4">
      <div className="glass-panel bg-white/95 w-full max-w-2xl p-10 md:p-14 shadow-2xl border-luxury-ink/10">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.5em] uppercase text-luxury-ink/40 mb-4">Client access</p>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold">Secure login</h2>
          <p className="mt-3 text-sm text-luxury-ink/60 max-w-2xl mx-auto">
            Access your account, manage bookings, and receive updates from Von Beauty.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.2em] text-luxury-ink/70">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="luxury-input mt-3"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm uppercase tracking-[0.2em] text-luxury-ink/70">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="luxury-input mt-3"
              placeholder="Enter your password"
              required
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <label className="flex items-center gap-3 text-sm text-luxury-ink/75">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-luxury-ink/30 rounded"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={onClose}
              className="text-sm uppercase tracking-[0.3em] text-luxury-ink/80 hover:text-luxury-ink"
            >
              Continue as guest
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="luxury-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log in
          </button>

          {submitted && (
            <p className="text-center text-sm text-luxury-ink/70 mt-2">
              Login request received. Continuing to the site…
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
