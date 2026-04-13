import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Upload, Users, FileText, ArrowLeft, ChevronRight, CheckCircle2, Clock, XCircle, Trash2, MessageSquare, Star } from 'lucide-react';
import { BookingData, Testimonial, UploadedImage } from '../types';
import { ImageUploadForm } from './ImageUploadForm';

interface DashboardProps {
  role: 'admin' | 'client' | 'guest';
  email: string | null;
  onBack: () => void;
  bookings: BookingData[];
  setBookings: React.Dispatch<React.SetStateAction<BookingData[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

const AdminDashboard = ({ 
  bookings, 
  setBookings, 
  testimonials, 
  setTestimonials,
  uploadedImages,
  setUploadedImages
}: { 
  bookings: BookingData[], 
  setBookings: React.Dispatch<React.SetStateAction<BookingData[]>>,
  testimonials: Testimonial[],
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  uploadedImages: UploadedImage[],
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>
}) => {
  const [search, setSearch] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'testimonials'>('bookings');

  const filteredBookings = useMemo(
    () => bookings.filter((booking) =>
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.name.toLowerCase().includes(search.toLowerCase()) ||
      booking.email.toLowerCase().includes(search.toLowerCase())
    ),
    [search, bookings]
  );

  const pendingTestimonials = testimonials.filter(t => t.status === 'pending');

  const totalClients = useMemo(
    () => new Set(bookings.map((booking) => booking.email)).size,
    [bookings]
  );

  const selectedBooking = bookings.find((booking) => booking.id === selectedBookingId) || filteredBookings[0] || null;

  const removeUploaded = (id: string) => {
    setUploadedImages((prev) => {
      const removed = prev.find((u) => u.id === id);
      if (removed) URL.revokeObjectURL(removed.src);
      return prev.filter((u) => u.id !== id);
    });
  };

  const updateStatus = (id: string, status: BookingData['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };

  const approveTestimonial = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };

  const deleteTestimonial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <Users size={20} />
            <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Clients consulted</p>
          </div>
          <p className="text-4xl md:text-5xl font-serif">{totalClients}</p>
          <p className="text-xs md:text-sm text-luxury-ink/60 mt-3">Distinct client emails in the current booking log.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <FileText size={20} />
            <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Total bookings</p>
          </div>
          <p className="text-4xl md:text-5xl font-serif">{bookings.length}</p>
          <p className="text-xs md:text-sm text-luxury-ink/60 mt-3">Live booking records available for lookup and management.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <MessageSquare size={20} />
            <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Pending Reviews</p>
          </div>
          <p className="text-4xl md:text-5xl font-serif">{pendingTestimonials.length}</p>
          <p className="text-xs md:text-sm text-luxury-ink/60 mt-3">Reviews awaiting approval before being published.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`text-xl md:text-2xl font-serif transition-colors ${activeTab === 'bookings' ? 'text-luxury-ink' : 'text-luxury-ink/30 hover:text-luxury-ink/50'}`}
              >
                Bookings
              </button>
              <button 
                onClick={() => setActiveTab('testimonials')}
                className={`text-xl md:text-2xl font-serif transition-colors ${activeTab === 'testimonials' ? 'text-luxury-ink' : 'text-luxury-ink/30 hover:text-luxury-ink/50'}`}
              >
                Testimonials
              </button>
            </div>
            <div className="w-fit rounded-full bg-luxury-ink/5 px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink">Management</div>
          </div>

          {activeTab === 'bookings' ? (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-ink/40" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search bookings..."
                  className="w-full rounded-3xl border border-luxury-ink/10 bg-white/90 py-4 pl-12 pr-4 text-sm focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-3">
                {filteredBookings.slice(0, 4).map((booking) => (
                  <div
                    key={booking.id}
                    className={`w-full text-left rounded-3xl border px-4 md:px-5 py-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${selectedBooking?.id === booking.id ? 'border-luxury-gold bg-luxury-gold/5' : 'border-luxury-ink/10 bg-white'}`}
                  >
                    <button 
                      onClick={() => setSelectedBookingId(booking.id)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm md:text-base">{booking.name}</span>
                        <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                          booking.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-luxury-ink/60 mt-1">{booking.service} · {booking.date} at {booking.time}</p>
                    </button>
                    
                    <div className="flex items-center gap-2 sm:ml-4">
                      {booking.status === 'Pending' && (
                        <button 
                          onClick={() => updateStatus(booking.id, 'Confirmed')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Confirm"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.filter(t => t.status === 'pending').length > 0 ? (
                testimonials.filter(t => t.status === 'pending').map((t) => (
                  <div key={t.id} className="rounded-3xl border border-luxury-ink/10 p-5 bg-white">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium">{t.author}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={10} className={i < t.rating ? 'text-luxury-gold' : 'text-luxury-ink/10'} fill={i < t.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => approveTestimonial(t.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteTestimonial(t.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-luxury-ink/70 italic">"{t.quote}"</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-luxury-ink/40 italic">No pending testimonials.</p>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <ImageUploadForm
            title="Import to Gallery"
            description="Add new looks to your public portfolio"
            uploadedImages={uploadedImages}
            onUpload={(newImages) => setUploadedImages(prev => [...prev, ...newImages])}
            onRemove={removeUploaded}
          />
        </section>
      </div>
    </div>
  );
};

const ClientDashboard = ({ email, bookings }: { email: string | null, bookings: BookingData[] }) => {
  const userBookings = bookings.filter(b => b.email === email);

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink/50 mb-3">Welcome back</p>
          <h3 className="text-2xl md:text-3xl font-serif">{email ? `Hello, ${email.split('@')[0]}` : 'Hello there'}</h3>
          <p className="mt-4 text-xs md:text-sm text-luxury-ink/60">Your client dashboard gives you a quick view of upcoming appointments, messages, and booking status.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink/50 mb-3">Next action</p>
          <p className="text-lg md:text-xl font-serif">View your latest booking requests</p>
          <p className="text-xs md:text-sm text-luxury-ink/60 mt-4">If you don’t see your event listed, book another consultation with the studio below.</p>
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 luxury-button w-full sm:w-auto"
          >
            Book a new appointment
          </button>
        </div>
      </div>

      <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl md:text-2xl font-serif">Upcoming appointments</h4>
            <p className="text-xs md:text-sm text-luxury-ink/60">Your next scheduled services at a glance.</p>
          </div>
          <span className="w-fit text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink/50">{userBookings.length} items</span>
        </div>

        <div className="space-y-4">
          {userBookings.length > 0 ? (
            userBookings.map((item) => (
              <div key={item.id} className="rounded-3xl border border-luxury-ink/10 p-5 bg-luxury-cream/60">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{item.service}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    item.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-luxury-ink/60 mt-2">{item.date} · {item.time}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-luxury-ink/40 italic">No appointments found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const Dashboard = ({ role, email, onBack, bookings, setBookings, testimonials, setTestimonials, uploadedImages, setUploadedImages }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-luxury-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-luxury-ink/50">{role === 'admin' ? 'Admin portal' : 'Client dashboard'}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mt-4">{role === 'admin' ? 'Von Beauty Admin' : 'Your client space'}</h1>
            <p className="mt-4 max-w-2xl text-sm text-luxury-ink/60">
              {role === 'admin'
                ? 'Manage bookings, approve testimonials, and monitor client consultations from one place.'
                : 'See your schedule, recent updates, and next steps after signing in.'}
            </p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-luxury-ink/10 bg-white px-5 py-3 text-sm uppercase tracking-[0.35em] text-luxury-ink transition hover:border-luxury-gold hover:text-luxury-gold"
          >
            <ArrowLeft size={16} /> Back to site
          </button>
        </div>

        {role === 'admin' ? (
          <AdminDashboard 
            bookings={bookings} 
            setBookings={setBookings} 
            testimonials={testimonials} 
            setTestimonials={setTestimonials} 
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        ) : (
          <ClientDashboard email={email} bookings={bookings} />
        )}

        <div className="mt-16 rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-lg md:text-xl font-serif">Need quick access?</h4>
              <p className="text-xs md:text-sm text-luxury-ink/60 mt-2">Use the admin portal to review booking data, imports, and client counts in real time.</p>
            </div>
            <button className="portfolio-button inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Open analytics <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
