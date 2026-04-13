import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Users, FileText, ArrowLeft, ChevronRight, 
  CheckCircle2, Clock, XCircle, Trash2, MessageSquare, 
  Star, Eye, EyeOff, LayoutDashboard, Calendar, 
  Image as ImageIcon, Settings, LogOut, Bell, TrendingUp
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { BookingData, Testimonial, UploadedImage } from '../types';
import { ImageUploadForm } from './ImageUploadForm';

interface DashboardProps {
  role: 'admin' | 'client' | 'guest';
  email: string | null;
  onBack: () => void;
  onLogout: () => void;
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
  setUploadedImages,
  onLogout
}: { 
  bookings: BookingData[], 
  setBookings: React.Dispatch<React.SetStateAction<BookingData[]>>,
  testimonials: Testimonial[],
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  uploadedImages: UploadedImage[],
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>,
  onLogout: () => void
}) => {
  const [search, setSearch] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'testimonials' | 'gallery'>('overview');

  // Mock data for the chart based on bookings
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      bookings: Math.floor(Math.random() * 20) + 5,
      revenue: Math.floor(Math.random() * 5000) + 2000,
    }));
  }, []);

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

  const toggleHideImage = (id: string) => {
    setUploadedImages(prev => prev.map(img => img.id === id ? { ...img, isHidden: !img.isHidden } : img));
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'bookings' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <Calendar size={18} />
            <span className="text-sm font-medium">Bookings</span>
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'testimonials' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <MessageSquare size={18} />
            <span className="text-sm font-medium">Reviews</span>
          </button>
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeTab === 'gallery' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <ImageIcon size={18} />
            <span className="text-sm font-medium">Gallery</span>
          </button>
          
          <div className="pt-8 mt-8 border-t border-luxury-ink/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 space-y-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <div className="flex items-center gap-3 text-luxury-gold mb-4">
                  <Users size={20} />
                  <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Clients</p>
                </div>
                <p className="text-4xl md:text-5xl font-serif">{totalClients}</p>
                <div className="flex items-center gap-1 text-green-600 text-[10px] mt-2">
                  <TrendingUp size={12} />
                  <span>+12% from last month</span>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <div className="flex items-center gap-3 text-luxury-gold mb-4">
                  <FileText size={20} />
                  <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Bookings</p>
                </div>
                <p className="text-4xl md:text-5xl font-serif">{bookings.length}</p>
                <div className="flex items-center gap-1 text-green-600 text-[10px] mt-2">
                  <TrendingUp size={12} />
                  <span>+5% from last month</span>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <div className="flex items-center gap-3 text-luxury-gold mb-4">
                  <MessageSquare size={20} />
                  <p className="uppercase tracking-[0.35em] text-[10px] md:text-xs text-luxury-ink/50">Pending</p>
                </div>
                <p className="text-4xl md:text-5xl font-serif">{pendingTestimonials.length}</p>
                <p className="text-[10px] text-luxury-ink/40 mt-2 italic">Awaiting approval</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-serif">Booking Trends</h4>
                  <select className="text-[10px] uppercase tracking-widest bg-transparent border-none focus:ring-0 text-luxury-ink/40">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#999' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#999' }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          fontSize: '12px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#D4AF37" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorBookings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-serif">Quick Actions</h4>
                  <Bell size={18} className="text-luxury-ink/20" />
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-luxury-cream/50 hover:bg-luxury-cream transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luxury-gold shadow-sm">
                        <Calendar size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Review Bookings</p>
                        <p className="text-[10px] text-luxury-ink/40">{bookings.filter(b => b.status === 'Pending').length} pending requests</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-luxury-ink/20 group-hover:text-luxury-gold transition-colors" />
                  </button>

                  <button 
                    onClick={() => setActiveTab('testimonials')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-luxury-cream/50 hover:bg-luxury-cream transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luxury-gold shadow-sm">
                        <MessageSquare size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Approve Reviews</p>
                        <p className="text-[10px] text-luxury-ink/40">{pendingTestimonials.length} new testimonials</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-luxury-ink/20 group-hover:text-luxury-gold transition-colors" />
                  </button>

                  <button 
                    onClick={() => setActiveTab('gallery')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-luxury-cream/50 hover:bg-luxury-cream transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luxury-gold shadow-sm">
                        <ImageIcon size={18} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Update Gallery</p>
                        <p className="text-[10px] text-luxury-ink/40">Add new looks to portfolio</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-luxury-ink/20 group-hover:text-luxury-gold transition-colors" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h4 className="text-xl md:text-2xl font-serif">Booking Management</h4>
              <div className="w-fit rounded-full bg-luxury-ink/5 px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink">Records</div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-ink/40" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email or ID..."
                  className="w-full rounded-3xl border border-luxury-ink/10 bg-white/90 py-4 pl-12 pr-4 text-sm focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-3">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-luxury-ink/40 italic">No bookings found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'testimonials' && (
          <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h4 className="text-xl md:text-2xl font-serif">Testimonial Approval</h4>
              <div className="w-fit rounded-full bg-luxury-ink/5 px-4 py-2 text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink">Reviews</div>
            </div>
            
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
                  <p className="text-sm text-luxury-ink/40 italic">No pending testimonials to review.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
              <ImageUploadForm
                title="Import to Gallery"
                description="Add new looks to your public portfolio"
                uploadedImages={uploadedImages}
                onUpload={(newImages) => setUploadedImages(prev => [...prev, ...newImages])}
                onRemove={removeUploaded}
              />
            </section>

            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-serif">Manage Collection</h4>
                <p className="text-[10px] uppercase tracking-widest text-luxury-ink/40">{uploadedImages.length} images</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.length > 0 ? (
                  uploadedImages.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-luxury-ink/10 bg-luxury-cream/30">
                      <img 
                        src={img.src} 
                        alt="Gallery" 
                        className={`w-full h-full object-cover transition-opacity duration-300 ${img.isHidden ? 'opacity-40 grayscale' : 'opacity-100'}`} 
                      />
                      
                      <div className="absolute inset-0 bg-luxury-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleHideImage(img.id)}
                          className="p-2 bg-white/90 hover:bg-white text-luxury-ink rounded-full transition-all hover:scale-110"
                          title={img.isHidden ? "Show in gallery" : "Hide from gallery"}
                        >
                          {img.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => removeUploaded(img.id)}
                          className="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full transition-all hover:scale-110"
                          title="Delete permanently"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {img.isHidden && (
                        <div className="absolute top-2 left-2 bg-luxury-ink/80 backdrop-blur-sm text-[8px] text-white uppercase tracking-widest px-2 py-1 rounded">
                          Archived
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 bg-white/80 backdrop-blur-sm text-[8px] text-luxury-ink uppercase tracking-widest px-2 py-1 rounded truncate text-center">
                        {img.category}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-sm text-luxury-ink/40 italic">No images uploaded yet.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
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
          {userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length > 0 ? (
            userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').map((item) => (
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
              <p className="text-sm text-luxury-ink/40 italic">No upcoming appointments found.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl md:text-2xl font-serif">Appointment History</h4>
          <span className="w-fit text-[10px] md:text-xs uppercase tracking-[0.35em] text-luxury-ink/50">Past records</span>
        </div>
        <div className="space-y-4">
          {userBookings.filter(b => b.status === 'Cancelled').length > 0 ? (
            userBookings.filter(b => b.status === 'Cancelled').map((item) => (
              <div key={item.id} className="rounded-3xl border border-luxury-ink/10 p-5 bg-white opacity-60">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{item.service}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-red-50 text-red-600">
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-luxury-ink/60 mt-2">{item.date} · {item.time}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-luxury-ink/30 italic">No past appointments to show.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const Dashboard = ({ role, email, onBack, onLogout, bookings, setBookings, testimonials, setTestimonials, uploadedImages, setUploadedImages }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-luxury-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-luxury-ink/50">{role === 'admin' ? 'Management Portal' : 'Client Space'}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mt-4">{role === 'admin' ? 'Von Beauty Admin' : 'Your client space'}</h1>
            <p className="mt-4 max-w-2xl text-sm text-luxury-ink/60">
              {role === 'admin'
                ? 'Welcome back, Von. Here is a summary of your studio activity and management tools.'
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
            onLogout={onLogout}
          />
        ) : (
          <ClientDashboard email={email} bookings={bookings} />
        )}
      </div>
    </div>
  );
};
