import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Upload, Users, FileText, ArrowLeft, ChevronRight } from 'lucide-react';

interface DashboardProps {
  role: 'admin' | 'client' | 'guest';
  email: string | null;
  onBack: () => void;
}

const bookingsData = [
  {
    id: 'BKG-001',
    name: 'Ariella Stone',
    email: 'ariella@example.com',
    service: 'Bridal Makeup',
    date: '2026-05-10',
    time: '10:00',
    status: 'Confirmed',
  },
  {
    id: 'BKG-002',
    name: 'Mila Hart',
    email: 'mila@example.com',
    service: 'Photoshoot Makeup',
    date: '2026-05-15',
    time: '14:30',
    status: 'Pending',
  },
  {
    id: 'BKG-003',
    name: 'Noah Rae',
    email: 'noah@example.com',
    service: 'Event Makeup',
    date: '2026-05-21',
    time: '18:00',
    status: 'Confirmed',
  },
];

const AdminDashboard = () => {
  const [search, setSearch] = useState('');
  const [importedImages, setImportedImages] = useState<string[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const filteredBookings = useMemo(
    () => bookingsData.filter((booking) =>
      booking.id.toLowerCase().includes(search.toLowerCase()) ||
      booking.name.toLowerCase().includes(search.toLowerCase()) ||
      booking.email.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const totalClients = useMemo(
    () => new Set(bookingsData.map((booking) => booking.email)).size,
    []
  );

  const selectedBooking = bookingsData.find((booking) => booking.id === selectedBookingId) || filteredBookings[0] || null;

  const handleImport = (files: FileList | null) => {
    if (!files) return;
    const validUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImportedImages((prev) => [...prev, ...validUrls]);
  };

  return (
    <div className="space-y-16">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <Users size={20} />
            <p className="uppercase tracking-[0.35em] text-xs text-luxury-ink/50">Clients consulted</p>
          </div>
          <p className="text-5xl font-serif">{totalClients}</p>
          <p className="text-sm text-luxury-ink/60 mt-3">Distinct client emails in the current booking log.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <FileText size={20} />
            <p className="uppercase tracking-[0.35em] text-xs text-luxury-ink/50">Total bookings</p>
          </div>
          <p className="text-5xl font-serif">{bookingsData.length}</p>
          <p className="text-sm text-luxury-ink/60 mt-3">Live booking records available for lookup and management.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center gap-3 text-luxury-gold mb-4">
            <Upload size={20} />
            <p className="uppercase tracking-[0.35em] text-xs text-luxury-ink/50">Imported images</p>
          </div>
          <p className="text-5xl font-serif">{importedImages.length}</p>
          <p className="text-sm text-luxury-ink/60 mt-3">Images imported for campaigns, client references, or social proof.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif">Booking lookup</h3>
              <p className="text-sm text-luxury-ink/60 mt-2">Search by booking ID, name, or email.</p>
            </div>
            <div className="rounded-full bg-luxury-ink/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-luxury-ink">Quick access</div>
          </div>

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
                <button
                  key={booking.id}
                  onClick={() => setSelectedBookingId(booking.id)}
                  className={`w-full text-left rounded-3xl border px-5 py-4 transition ${selectedBooking?.id === booking.id ? 'border-luxury-gold bg-luxury-gold/5' : 'border-luxury-ink/10 bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{booking.name}</span>
                    <span className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50">{booking.status}</span>
                  </div>
                  <p className="text-sm text-luxury-ink/60 mt-1">{booking.service} · {booking.date} at {booking.time}</p>
                  <p className="text-xs text-luxury-ink/50 mt-2">{booking.email}</p>
                </button>
              ))}
              {filteredBookings.length === 0 && (
                <p className="text-sm text-luxury-ink/60">No bookings match your query.</p>
              )}
            </div>

            {selectedBooking && (
              <div className="rounded-[2rem] bg-luxury-cream/60 p-6 border border-luxury-ink/10">
                <h4 className="text-lg font-semibold mb-3">Selected booking</h4>
                <p className="text-sm text-luxury-ink/75">ID: {selectedBooking.id}</p>
                <p className="text-sm text-luxury-ink/75">Client: {selectedBooking.name}</p>
                <p className="text-sm text-luxury-ink/75">Email: {selectedBooking.email}</p>
                <p className="text-sm text-luxury-ink/75">Service: {selectedBooking.service}</p>
                <p className="text-sm text-luxury-ink/75">Schedule: {selectedBooking.date} · {selectedBooking.time}</p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif">Import images</h3>
              <p className="text-sm text-luxury-ink/60 mt-2">Upload reference or gallery images for new looks.</p>
            </div>
            <Upload size={20} className="text-luxury-gold" />
          </div>

          <label className="block rounded-[2rem] border border-dashed border-luxury-ink/20 bg-luxury-cream/80 p-8 text-center cursor-pointer hover:border-luxury-gold/50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(event) => handleImport(event.target.files)}
            />
            <p className="text-sm text-luxury-ink/70">Click to import image files or drag them onto this area.</p>
          </label>

          {importedImages.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {importedImages.slice(0, 4).map((src, index) => (
                <img key={index} src={src} alt={`Imported ${index + 1}`} className="h-32 w-full rounded-3xl object-cover" />
              ))}
            </div>
          )}

          <div className="mt-8 rounded-[2rem] border border-luxury-ink/10 bg-white p-5 text-sm text-luxury-ink/70">
            Imported images help you keep a visual archive of client requests, campaigns, and reference mood boards.
          </div>
        </section>
      </div>
    </div>
  );
};

const ClientDashboard = ({ email }: { email: string | null }) => {
  const upcoming = [
    { label: 'Consultation', date: '2026-05-18', time: '11:30', status: 'Pending' },
    { label: 'Makeup trial', date: '2026-06-01', time: '14:00', status: 'Confirmed' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50 mb-3">Welcome back</p>
          <h3 className="text-3xl font-serif">{email ? `Hello, ${email.split('@')[0]}` : 'Hello there'}</h3>
          <p className="mt-4 text-sm text-luxury-ink/60">Your client dashboard gives you a quick view of upcoming appointments, messages, and booking status.</p>
        </div>

        <div className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50 mb-3">Next action</p>
          <p className="text-xl font-serif">View your latest booking requests</p>
          <p className="text-sm text-luxury-ink/60 mt-4">If you don’t see your event listed, book another consultation with the studio below.</p>
          <button
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-6 luxury-button"
          >
            Book a new appointment
          </button>
        </div>
      </div>

      <section className="rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-2xl font-serif">Upcoming appointments</h4>
            <p className="text-sm text-luxury-ink/60">Your next scheduled services at a glance.</p>
          </div>
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50">{upcoming.length} items</span>
        </div>

        <div className="space-y-4">
          {upcoming.map((item, index) => (
            <div key={index} className="rounded-3xl border border-luxury-ink/10 p-5 bg-luxury-cream/60">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{item.label}</p>
                <span className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50">{item.status}</span>
              </div>
              <p className="text-sm text-luxury-ink/60 mt-2">{item.date} · {item.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const Dashboard = ({ role, email, onBack }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-luxury-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-luxury-ink/50">{role === 'admin' ? 'Admin portal' : 'Client dashboard'}</p>
            <h1 className="text-5xl font-serif italic mt-4">{role === 'admin' ? 'Von Beauty Admin' : 'Your client space'}</h1>
            <p className="mt-4 max-w-2xl text-sm text-luxury-ink/60">
              {role === 'admin'
                ? 'Manage bookings, import images, and monitor client consultations from one place.'
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

        {role === 'admin' ? <AdminDashboard /> : <ClientDashboard email={email} />}

        <div className="mt-16 rounded-[2rem] bg-white p-8 border border-luxury-ink/10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-serif">Need quick access?</h4>
              <p className="text-sm text-luxury-ink/60 mt-2">Use the admin portal to review booking data, imports, and client counts in real time.</p>
            </div>
            <button className="portfolio-button inline-flex items-center gap-2">
              Open analytics <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
