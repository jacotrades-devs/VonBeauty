import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Mail, MessageSquare, Sparkles } from 'lucide-react';

export const Booking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Event Makeup',
    date: '',
    time: '',
    notes: '',
    status: 'Pending'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const services = [
    'Event Makeup',
    'Pageant Makeup',
    'Photoshoot Makeup',
    'Bridal Makeup'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxDaYtrSbDufczNnoyjW1A3fqCDFvaHSE6CgfKpopeiMX7uQ6xIv2xi5zvjcBwxpNmZ/exec",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setMessage({
          type: "success",
          text: "Booking request sent successfully! I’ll contact you soon.",
        });

        setFormData({
          name: "",
          email: "",
          service: "Event Makeup",
          date: "",
          time: "",
          notes: "",
          status: "Pending"
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-3 rounded-full bg-luxury-gold/10 text-luxury-gold mb-4"
          >
            <Sparkles size={24} />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-serif italic text-luxury-ink">Reserve Your <span className="text-luxury-gold">Experience</span></h2>
          <p className="text-luxury-ink/60 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Secure your date for a bespoke beauty transformation. Please provide your details below, and I will personally reach out to confirm your appointment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-luxury-cream/30 backdrop-blur-md p-8 md:p-16 rounded-4xl border border-luxury-ink/5 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <User size={12} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light"
                  placeholder="Evelyn Vane"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light"
                  placeholder="evelyn@example.com"
                />
              </div>

              {/* Service Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <Sparkles size={12} /> Select Service
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light appearance-none cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <Calendar size={12} /> Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light"
                />
              </div>

              {/* Time */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <Clock size={12} /> Preferred Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light"
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                  <MessageSquare size={12} /> Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white/50 border border-luxury-ink/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors font-light resize-none"
                  placeholder="Tell me about your event or any specific requirements..."
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full luxury-button py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-500
                    ${loading ? "opacity-60 cursor-not-allowed" : "bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink"}
                  `}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </>
                  ) : (
                    "Request Appointment"
                  )}
                </button>
                <p className="text-center text-[10px] text-luxury-ink/40 mt-6 uppercase tracking-widest">
                  * Submission does not guarantee booking. I will contact you within 24 hours.
                </p>
              </div>
            </form>
            {message.text && message.type === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-6 p-6 rounded-2xl border bg-luxury-gold/10 border-luxury-gold/30 backdrop-blur-md flex items-center gap-4 shadow-lg"
              >
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-luxury-gold/20">
                  <motion.svg
                    viewBox="0 0 52 52"
                    className="w-8 h-8 text-luxury-gold"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 27l7 7 16-16"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                    />
                  </motion.svg>

                  <motion.div
                    className="absolute inset-0 rounded-full bg-luxury-gold/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                <div>
                  <p className="text-luxury-ink font-medium">
                    Booking Confirmed
                  </p>
                  <p className="text-sm text-luxury-ink/60">
                    {message.text}
                  </p>
                </div>
              </motion.div>
            )}
            {message.text && message.type === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl border bg-red-500/10 text-red-600 border-red-400/30"
              >
                {message.text}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
