import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Users, FileText, ArrowLeft, ChevronRight, 
  CheckCircle2, Clock, XCircle, Trash2, MessageSquare, 
  Star, Eye, EyeOff, LayoutDashboard, Calendar, 
  Image as ImageIcon, Sparkles, LogOut, TrendingUp, Plus, ShieldCheck, Tag,
  Pencil, Upload, X, Check, ToggleLeft, ToggleRight, RefreshCw
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { doc, updateDoc, deleteDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType, firebaseConfig, subscribeDatabaseStatus } from '../lib/firebase';
import { BookingData, Testimonial, UploadedImage, CategoryItem, GenderTag } from '../types';
import { ImageUploadForm } from './ImageUploadForm';
import { compressImageToDataUrl } from '../lib/imageUtils';

interface DashboardProps {
  role: 'admin' | 'client' | 'guest';
  email: string | null;
  onBack: () => void;
  onLogout: () => void;
  bookings: BookingData[];
  testimonials: Testimonial[];
  uploadedImages: UploadedImage[];
  categories?: string[];
  customCategories?: CategoryItem[];
  onOpenSOP?: () => void;
}

const AdminDashboard = ({ 
  bookings, 
  testimonials, 
  uploadedImages,
  categories = ['Bridal Makeup', 'Event Makeup', 'Pageant Makeup', 'Photoshoot Makeup', 'Transformation'],
  customCategories = [],
  onOpenSOP,
  onLogout
}: { 
  bookings: BookingData[]; 
  testimonials: Testimonial[];
  uploadedImages: UploadedImage[];
  categories?: string[];
  customCategories?: CategoryItem[];
  onOpenSOP?: () => void;
  onLogout: () => void;
}) => {
  const [search, setSearch] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  // Sub-route synchronization for /admin, /admin/dashboard, /admin/gallery, /admin/categories
  const getInitialTab = (): 'overview' | 'bookings' | 'testimonials' | 'gallery' | 'categories' => {
    if (typeof window === 'undefined') return 'overview';
    const path = window.location.pathname;
    if (path.includes('/admin/gallery')) return 'gallery';
    if (path.includes('/admin/categories')) return 'categories';
    if (path.includes('/admin/bookings')) return 'bookings';
    if (path.includes('/admin/reviews') || path.includes('/admin/testimonials')) return 'testimonials';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'testimonials' | 'gallery' | 'categories'>(getInitialTab);

  const handleTabChange = (tab: 'overview' | 'bookings' | 'testimonials' | 'gallery' | 'categories') => {
    setActiveTab(tab);
    const targetUrl = tab === 'overview' ? '/admin/dashboard' : `/admin/${tab}`;
    if (typeof window !== 'undefined' && window.location.pathname !== targetUrl) {
      window.history.pushState({ tab }, '', targetUrl);
    }
  };

  useEffect(() => {
    const handlePop = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const [databaseMissing, setDatabaseMissing] = useState(false);
  useEffect(() => {
    return subscribeDatabaseStatus((missing) => {
      setDatabaseMissing(missing);
    });
  }, []);
  
  // Gallery filter states in dashboard
  const [galleryGenderFilter, setGalleryGenderFilter] = useState<'All' | GenderTag>('All');
  const [galleryCatFilter, setGalleryCatFilter] = useState<string>('All');

  // Category creation form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [catMessage, setCatMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Image Modal state
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editGender, setEditGender] = useState<GenderTag>('Female');
  const [editReplacementFile, setEditReplacementFile] = useState<File | null>(null);
  const [editReplacementPreview, setEditReplacementPreview] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [imageEditError, setImageEditError] = useState<string | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Category Modal state
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

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
      booking.id?.toLowerCase().includes(search.toLowerCase()) ||
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

  // Filtered gallery in admin
  const filteredGalleryImages = useMemo(() => {
    return uploadedImages.filter(img => {
      const matchGender = galleryGenderFilter === 'All' || img.gender === galleryGenderFilter;
      const matchCat = galleryCatFilter === 'All' || img.category === galleryCatFilter;
      return matchGender && matchCat;
    });
  }, [uploadedImages, galleryGenderFilter, galleryCatFilter]);

  // Recent 4 uploaded images for overview
  const recentUploads = useMemo(() => {
    return [...uploadedImages].slice(0, 4);
  }, [uploadedImages]);

  const removeUploaded = async (img: UploadedImage) => {
    const title = img.lookName || img.title || 'this portfolio photo';
    if (window.confirm(`Permanently delete "${title}"? This will delete the photo file from Firebase Storage and remove the record from Firestore.`)) {
      try {
        // 1. Delete the corresponding Firebase Storage file if storagePath exists
        if (img.storagePath) {
          try {
            await deleteObject(ref(storage, img.storagePath));
          } catch (storageErr) {
            console.warn('Storage file deletion notice:', storageErr);
          }
        }
        // 2. Delete Firestore document
        await deleteDoc(doc(db, 'gallery', img.id));
      } catch (error) {
        console.error('Delete error:', error);
        handleFirestoreError(error, OperationType.DELETE, `gallery/${img.id}`);
        alert('Failed to delete image. Please check administrator permissions.');
      }
    }
  };

  const toggleHideImage = async (id: string, currentHidden: boolean) => {
    try {
      await updateDoc(doc(db, 'gallery', id), { isHidden: !currentHidden });
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `gallery/${id}`);
    }
  };

  const openEditImage = (img: UploadedImage) => {
    setEditingImage(img);
    setEditTitle(img.lookName || img.title || '');
    setEditCategory(img.category || categories[0]);
    setEditGender((img.demographic || img.gender || 'Female') as GenderTag);
    setEditReplacementFile(null);
    setEditReplacementPreview(null);
    setImageEditError(null);
  };

  const handleReplacementFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditReplacementFile(file);
      const url = URL.createObjectURL(file);
      setEditReplacementPreview(url);
    }
  };

  const handleSaveImageChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    setIsSavingImage(true);
    setImageEditError(null);

    try {
      let finalSrc = editingImage.imageUrl || editingImage.src;
      let finalStoragePath = editingImage.storagePath;

      // If user replaced the photo file
      if (editReplacementFile) {
        // Direct compression - instant, 100% free, zero CORS or Blaze errors
        const compressed = await compressImageToDataUrl(editReplacementFile, 1280, 1280, 0.80);
        finalSrc = compressed.dataUrl;
        finalStoragePath = null;
      }

      await updateDoc(doc(db, 'gallery', editingImage.id), {
        imageUrl: finalSrc,
        src: finalSrc,
        storagePath: finalStoragePath || null,
        lookName: editTitle.trim(),
        title: editTitle.trim(),
        categoryId: editCategory,
        categoryName: editCategory,
        category: editCategory,
        demographic: editGender,
        gender: editGender,
        updatedAt: serverTimestamp()
      });

      setEditingImage(null);
      setEditReplacementFile(null);
      setEditReplacementPreview(null);
    } catch (err: any) {
      console.error('Error updating image:', err);
      handleFirestoreError(err, OperationType.UPDATE, `gallery/${editingImage.id}`);
      setImageEditError('Failed to update image details. Please verify administrator permissions.');
    } finally {
      setIsSavingImage(false);
    }
  };

  const updateStatus = async (id: string, status: BookingData['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  const deleteBooking = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch (error) {
        console.error(error);
        handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
      }
    }
  };

  const approveTestimonial = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), { status: 'approved' });
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `testimonials/${id}`);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
      } catch (error) {
        console.error(error);
        handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsAddingCat(true);
    setCatMessage(null);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        isActive: true,
        disabled: false,
        isCore: false,
        isProtected: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCatMessage({ type: 'success', text: `Category "${newCatName.trim()}" added successfully!` });
      setNewCatName('');
      setNewCatDesc('');
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.WRITE, 'categories');
      setCatMessage({ type: 'error', text: 'Failed to add category. Please check permissions.' });
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleToggleCategoryDisable = async (catId: string, currentDisabled?: boolean) => {
    const nextDisabled = !currentDisabled;
    try {
      await updateDoc(doc(db, 'categories', catId), {
        disabled: nextDisabled,
        isActive: !nextDisabled,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, `categories/${catId}`);
    }
  };

  const openEditCategory = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || '');
  };

  const handleSaveCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    setIsSavingCategory(true);
    try {
      await updateDoc(doc(db, 'categories', editingCategory.id), {
        name: editCatName.trim(),
        description: editCatDesc.trim(),
        updatedAt: serverTimestamp(),
      });
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, OperationType.UPDATE, `categories/${editingCategory.id}`);
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (window.confirm(`Delete the custom category "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'categories', catId));
      } catch (err) {
        console.error(err);
        handleFirestoreError(err, OperationType.DELETE, `categories/${catId}`);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-2">
          <button 
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === 'overview' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Overview</span>
          </button>
          <button 
            onClick={() => handleTabChange('bookings')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === 'bookings' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <Calendar size={18} />
            <span className="text-sm font-medium">Bookings</span>
          </button>
          <button 
            onClick={() => handleTabChange('testimonials')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === 'testimonials' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <MessageSquare size={18} />
            <span className="text-sm font-medium">Reviews</span>
          </button>
          <button 
            onClick={() => handleTabChange('gallery')}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === 'gallery' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon size={18} />
              <span className="text-sm font-medium">Gallery & Upload</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold font-bold tracking-wider uppercase">
              + Add
            </span>
          </button>
          <button 
            onClick={() => handleTabChange('categories')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-pointer ${activeTab === 'categories' ? 'bg-luxury-ink text-white shadow-lg' : 'text-luxury-ink/60 hover:bg-white hover:text-luxury-ink'}`}
          >
            <Tag size={18} />
            <span className="text-sm font-medium">Makeup Categories</span>
          </button>
          
          <div className="pt-6 mt-6 border-t border-luxury-ink/10 space-y-2">
            {onOpenSOP && (
              <button 
                onClick={onOpenSOP}
                className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-luxury-gold bg-luxury-ink/5 hover:bg-luxury-gold/10 transition-all cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span className="text-xs uppercase tracking-wider font-semibold">Studio SOP</span>
              </button>
            )}

            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-6 py-3.5 rounded-2xl text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
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
            {/* Database Setup Notice if Firestore not yet created in console */}
            {databaseMissing && (
              <div className="p-6 md:p-8 rounded-[2rem] bg-amber-50 border border-amber-300/80 text-amber-950 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200/80 flex items-center justify-center text-amber-900 font-bold text-base shrink-0">
                      ⚡
                    </div>
                    <div>
                      <h4 className="font-serif italic text-lg sm:text-xl text-amber-950 font-bold">
                        Firestore Database Setup Required
                      </h4>
                      <p className="text-xs text-amber-800">
                        Firebase Project: <code className="bg-amber-200/60 px-2 py-0.5 rounded font-mono font-bold text-amber-950">{firebaseConfig.projectId}</code>
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-amber-900 text-white hover:bg-amber-800 text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-xs inline-flex items-center gap-2 self-start sm:self-auto"
                  >
                    Open Firebase Console &rarr;
                  </a>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-light">
                  Firebase requires you to click <strong>"Create database"</strong> once in the Firebase Console before documents can be saved. This is <strong>100% Free</strong> on the Firebase Spark tier (no Blaze plan or credit card required).
                </p>
                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 text-xs space-y-2 text-amber-950">
                  <p className="font-semibold text-amber-950">Quick 3-Step Setup (takes 30 seconds):</p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-900 font-light">
                    <li>Click <strong>Open Firebase Console</strong> above.</li>
                    <li>Click <strong>"Create database"</strong> &gt; Keep Database ID as <strong>(default)</strong> &gt; Click <strong>Next</strong>.</li>
                    <li>Select a location (e.g. <em>asia-southeast1</em> or <em>asia-east1</em>) &gt; Click <strong>Create</strong>.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Quick Action Banner */}
            <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-r from-luxury-ink to-luxury-ink/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">Quick Actions</span>
                <h3 className="text-xl md:text-2xl font-serif italic mt-1">Ready to add new photos?</h3>
                <p className="text-xs text-white/70 mt-1 max-w-xl">
                  Upload high-resolution makeup looks, choose categories (Bridal, Event, etc.), and tag demographics (Female, Male, Gender-Inclusive).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="px-6 py-3.5 rounded-full bg-luxury-gold text-luxury-ink hover:bg-white transition-all text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Plus size={16} /> Upload New Photo
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all text-xs uppercase tracking-widest font-medium cursor-pointer"
                >
                  + Add Category
                </button>
              </div>
            </div>

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
                  <span className="text-[10px] uppercase tracking-widest text-luxury-ink/40">Real-time stats</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C5A880" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#C5A880" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
                <h4 className="text-xl font-serif mb-6">Quick Overview</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-luxury-cream/40 rounded-2xl border border-luxury-ink/5">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-luxury-ink/60">Portfolio Photos</span>
                      <span className="block font-serif text-lg font-bold text-luxury-ink">{uploadedImages.length}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="px-3 py-1.5 rounded-xl bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                    >
                      + Upload
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-luxury-cream/40 rounded-2xl border border-luxury-ink/5">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-luxury-ink/60">Active Categories</span>
                      <span className="block font-serif text-lg font-bold text-luxury-ink">{categories.length}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('categories')}
                      className="px-3 py-1.5 rounded-xl bg-luxury-ink/5 hover:bg-luxury-ink/10 text-luxury-ink text-[10px] uppercase tracking-wider font-medium transition-all cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-luxury-cream/40 rounded-2xl border border-luxury-ink/5">
                    <span className="text-xs uppercase tracking-wider text-luxury-ink/60">Customer Reviews</span>
                    <span className="font-serif text-lg font-bold text-luxury-ink">{testimonials.length}</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Recently Uploaded Images Section in Overview */}
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-serif">Recently Uploaded Portfolio Photos</h4>
                  <p className="text-xs text-luxury-ink/40 mt-1">Latest makeup portfolio additions</p>
                </div>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className="text-xs font-semibold uppercase tracking-wider text-luxury-gold hover:text-luxury-ink transition-colors flex items-center gap-1 cursor-pointer"
                >
                  View All Gallery ({uploadedImages.length}) <ChevronRight size={14} />
                </button>
              </div>

              {recentUploads.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recentUploads.map((img) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-luxury-ink/10 bg-luxury-cream/30 aspect-[3/4] shadow-xs">
                      <img 
                        src={img.src} 
                        alt={img.title || "Gallery photo"} 
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-luxury-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditImage(img)}
                          className="p-2.5 bg-white text-luxury-ink rounded-full transition-all hover:scale-110 cursor-pointer shadow-md"
                          title="Edit details / Replace"
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-luxury-ink/80 backdrop-blur-md text-[8px] text-white uppercase tracking-widest px-2 py-0.5 rounded-md font-medium">
                          {img.gender || 'Female'}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md text-[8px] text-luxury-ink uppercase tracking-widest px-2 py-1 rounded-md truncate text-center font-semibold">
                        {img.title || img.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-luxury-cream/30 rounded-2xl border border-dashed border-luxury-ink/15">
                  <p className="text-xs text-luxury-ink/50 italic mb-3">No portfolio images uploaded yet.</p>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="px-5 py-2.5 rounded-full bg-luxury-gold text-luxury-ink text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-white transition-all shadow-sm"
                  >
                    + Upload First Photo
                  </button>
                </div>
              )}
            </section>

            {/* Makeup Categories Quick Summary */}
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-serif">Makeup Services & Styles</h4>
                  <p className="text-xs text-luxury-ink/40 mt-1">Core services and dynamic custom categories</p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-xs font-semibold uppercase tracking-wider text-luxury-gold hover:text-luxury-ink transition-colors flex items-center gap-1 cursor-pointer"
                >
                  Manage Categories <ChevronRight size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((catName) => (
                  <span
                    key={catName}
                    className="px-3.5 py-1.5 rounded-full bg-luxury-cream/60 border border-luxury-ink/10 text-xs text-luxury-ink flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                    {catName}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-luxury-ink/10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-ink/30" size={16} />
                <input
                  type="text"
                  placeholder="Search bookings by client name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-luxury-ink/30"
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white overflow-hidden border border-luxury-ink/10 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-luxury-cream/60 border-b border-luxury-ink/5 text-[10px] uppercase tracking-widest text-luxury-ink/50">
                    <tr>
                      <th className="p-4 sm:p-6">Client</th>
                      <th className="p-4 sm:p-6">Service</th>
                      <th className="p-4 sm:p-6">Schedule</th>
                      <th className="p-4 sm:p-6">Status</th>
                      <th className="p-4 sm:p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-ink/5">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-luxury-cream/20 transition-colors">
                          <td className="p-4 sm:p-6">
                            <p className="font-medium text-luxury-ink">{b.name}</p>
                            <p className="text-xs text-luxury-ink/40">{b.email}</p>
                          </td>
                          <td className="p-4 sm:p-6">
                            <span className="px-3 py-1 rounded-full bg-luxury-gold/10 text-luxury-gold text-xs font-medium">
                              {b.service}
                            </span>
                          </td>
                          <td className="p-4 sm:p-6">
                            <p className="text-luxury-ink">{b.date}</p>
                            <p className="text-xs text-luxury-ink/40">{b.time}</p>
                          </td>
                          <td className="p-4 sm:p-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                              b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-4 sm:p-6 text-right space-x-2">
                            {b.status !== 'Confirmed' && (
                              <button
                                onClick={() => updateStatus(b.id, 'Confirmed')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                                title="Confirm booking"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            {b.status !== 'Cancelled' && (
                              <button
                                onClick={() => updateStatus(b.id, 'Cancelled')}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="Cancel booking"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteBooking(b.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete booking"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-luxury-ink/40 italic">
                          No bookings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-serif">Client Reviews Moderation</h4>
                <p className="text-xs text-luxury-ink/40 mt-1">Approve pending reviews to display on the live website</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                {pendingTestimonials.length} Pending
              </span>
            </div>

            <div className="space-y-4">
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <div key={t.id} className="p-5 rounded-2xl border border-luxury-ink/10 bg-luxury-cream/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm text-luxury-ink">{t.author}</span>
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-medium ${
                          t.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {t.status}
                        </span>
                        <div className="flex text-luxury-gold">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-luxury-ink/75 italic max-w-2xl">"{t.quote}"</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {t.status === 'pending' && (
                        <button
                          onClick={() => approveTestimonial(t.id)}
                          className="px-4 py-1.5 rounded-full bg-green-600 text-white text-xs hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteTestimonial(t.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-luxury-ink/40 italic">
                  No client reviews yet.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Direct Dashboard Media Upload Form */}
            <ImageUploadForm
              title="Add New Makeup Photo"
              description="Upload portfolio photos categorized by makeup type and client demographic (Female, Male, Gender-Inclusive)"
              categories={categories}
            />

            {/* Manage Uploaded Photos */}
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-serif">Portfolio Collection Management</h4>
                  <p className="text-xs text-luxury-ink/40 mt-1">Showing {filteredGalleryImages.length} of {uploadedImages.length} total uploads</p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={galleryGenderFilter}
                    onChange={(e) => setGalleryGenderFilter(e.target.value as any)}
                    className="text-xs bg-luxury-cream/50 border border-luxury-ink/10 rounded-xl px-3 py-2 text-luxury-ink focus:outline-none"
                  >
                    <option value="All">All Genders</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Gender-Inclusive">Gender-Inclusive</option>
                  </select>

                  <select
                    value={galleryCatFilter}
                    onChange={(e) => setGalleryCatFilter(e.target.value)}
                    className="text-xs bg-luxury-cream/50 border border-luxury-ink/10 rounded-xl px-3 py-2 text-luxury-ink focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid of Images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredGalleryImages.length > 0 ? (
                  filteredGalleryImages.map((img) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-luxury-ink/10 bg-luxury-cream/30 aspect-[3/4] shadow-xs">
                      <img 
                        src={img.src} 
                        alt={img.title || "Gallery"} 
                        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${img.isHidden ? 'opacity-40 grayscale' : 'opacity-100'}`} 
                      />
                      
                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-luxury-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                        <button
                          onClick={() => openEditImage(img)}
                          className="p-2.5 bg-white text-luxury-ink rounded-full transition-all hover:scale-110 cursor-pointer shadow-md"
                          title="Edit look details or replace photo"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleHideImage(img.id, !!img.isHidden)}
                          className="p-2.5 bg-white text-luxury-ink rounded-full transition-all hover:scale-110 cursor-pointer shadow-md"
                          title={img.isHidden ? "Show in public gallery" : "Hide from public gallery"}
                        >
                          {img.isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => removeUploaded(img)}
                          className="p-2.5 bg-red-500 text-white rounded-full transition-all hover:scale-110 cursor-pointer shadow-md"
                          title="Delete permanently"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Status & Category Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="bg-luxury-ink/80 backdrop-blur-md text-[8px] text-white uppercase tracking-widest px-2 py-0.5 rounded-md font-medium">
                          {img.gender || 'Female'}
                        </span>
                        {img.isHidden && (
                          <span className="bg-red-500/90 text-[8px] text-white uppercase tracking-widest px-2 py-0.5 rounded-md font-medium">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md text-[8px] text-luxury-ink uppercase tracking-widest px-2 py-1 rounded-md truncate text-center font-medium">
                        {img.category}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-luxury-cream/20 rounded-2xl border border-dashed border-luxury-ink/15">
                    <p className="text-sm text-luxury-ink/40 italic">No images found for this category or demographic filter.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Categories Tab: Dynamic Category Management */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Create Category Form */}
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-medium">
                <Plus size={16} /> Expand Your Services
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-serif italic text-luxury-ink">Add Custom Makeup Category</h4>
                <p className="text-xs text-luxury-ink/50 mt-1">
                  Create custom categories (e.g. "Airbrush Bridal", "Debut / Quinceañera", "Editorial Runway"). These will automatically appear in your portfolio filters, image uploads, and client booking dropdown.
                </p>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-2 font-semibold">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Airbrush Makeup, Debut Look..."
                      className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-2 font-semibold">
                      Brief Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="e.g. High-definition flawless airbrush application"
                      className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {catMessage && (
                    <span className={`text-xs ${catMessage.type === 'success' ? 'text-green-600 font-medium' : 'text-red-500'}`}>
                      {catMessage.text}
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isAddingCat}
                    className="ml-auto px-6 py-3 rounded-full bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink transition-colors text-xs uppercase tracking-widest font-semibold cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isAddingCat ? 'Creating...' : '+ Create Category'}
                  </button>
                </div>
              </form>
            </section>

            {/* List of Categories */}
            <section className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm space-y-6">
              <h4 className="text-xl font-serif">Active Service & Makeup Categories</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Standard Base Categories */}
                {['Bridal Makeup', 'Event Makeup', 'Pageant Makeup', 'Photoshoot Makeup', 'Transformation'].map(baseCat => (
                  <div key={baseCat} className="p-4 rounded-2xl border border-luxury-ink/10 bg-luxury-cream/20 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-luxury-ink">{baseCat}</p>
                      <span className="text-[9px] uppercase tracking-wider text-luxury-gold font-semibold">Standard Core</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-ink/5 text-luxury-ink/50">Protected</span>
                  </div>
                ))}

                {/* Custom Admin Categories */}
                {customCategories.map(cat => (
                  <div 
                    key={cat.id} 
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      cat.disabled 
                        ? 'border-luxury-ink/10 bg-luxury-cream/10 opacity-70' 
                        : 'border-luxury-gold/30 bg-luxury-gold/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm text-luxury-ink truncate">{cat.name}</p>
                        <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                          cat.disabled 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {cat.disabled ? 'Disabled' : 'Active'}
                        </span>
                      </div>
                      <p className="text-[10px] text-luxury-ink/50 truncate mt-0.5">
                        {cat.description || 'Custom Category'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleCategoryDisable(cat.id, cat.disabled)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          cat.disabled 
                            ? 'text-gray-400 hover:text-green-600 hover:bg-green-50' 
                            : 'text-green-600 hover:text-gray-400 hover:bg-gray-100'
                        }`}
                        title={cat.disabled ? "Enable category for public booking & gallery" : "Disable category"}
                      >
                        {cat.disabled ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}
                      </button>
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="p-2 text-luxury-ink/60 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-full transition-colors cursor-pointer"
                        title="Edit category name & description"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Edit Image Modal */}
      <AnimatePresence>
        {editingImage && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSavingImage && setEditingImage(null)}
              className="absolute inset-0 bg-luxury-ink/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-luxury-ink/10 overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-luxury-ink/10">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Media Management</span>
                  <h3 className="text-xl font-serif italic text-luxury-ink">Edit Portfolio Photo</h3>
                </div>
                <button
                  onClick={() => !isSavingImage && setEditingImage(null)}
                  disabled={isSavingImage}
                  className="p-2 rounded-full hover:bg-luxury-cream text-luxury-ink/40 hover:text-luxury-ink transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveImageChanges} className="mt-6 space-y-5">
                {/* Image Preview & Replace */}
                <div className="flex items-center gap-4 p-3 bg-luxury-cream/40 rounded-2xl border border-luxury-ink/5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-luxury-ink/10 shrink-0 border border-luxury-ink/10 relative">
                    <img
                      src={editReplacementPreview || editingImage.src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {editReplacementPreview && (
                      <span className="absolute top-1 right-1 bg-green-500 text-white text-[7px] px-1 py-0.5 rounded font-bold uppercase">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-medium text-luxury-ink">Replace Photo File</p>
                    <p className="text-[10px] text-luxury-ink/40">Select a new image file to replace this look</p>
                    <button
                      type="button"
                      onClick={() => replaceFileInputRef.current?.click()}
                      className="mt-1 px-3 py-1.5 rounded-lg border border-luxury-gold text-luxury-gold text-[10px] uppercase tracking-wider font-semibold hover:bg-luxury-gold hover:text-luxury-ink transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload size={12} /> Choose New Photo
                    </button>
                    <input
                      ref={replaceFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReplacementFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Look Name / Client Description */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-1.5 font-semibold">
                    Look Name / Client Description
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Royal Bridal Glam, Sunset Runway"
                    className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                  />
                </div>

                {/* Makeup Category */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-1.5 font-semibold">
                    Makeup Category / Service Style *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Target Demographic / Gender */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-1.5 font-semibold">
                    Target Demographic / Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Female', 'Male', 'Gender-Inclusive'] as GenderTag[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setEditGender(g)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          editGender === g
                            ? 'border-luxury-gold bg-luxury-gold/15 text-luxury-ink font-semibold'
                            : 'border-luxury-ink/10 bg-luxury-cream/30 text-luxury-ink/60 hover:border-luxury-gold/40'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {imageEditError && (
                  <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">{imageEditError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-ink/10">
                  <button
                    type="button"
                    onClick={() => setEditingImage(null)}
                    disabled={isSavingImage}
                    className="px-5 py-2.5 rounded-full border border-luxury-ink/20 text-luxury-ink text-xs uppercase tracking-wider font-medium hover:bg-luxury-cream cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingImage}
                    className="px-6 py-2.5 rounded-full bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink text-xs uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSavingImage ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
          <div className="fixed inset-0 z-120 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSavingCategory && setEditingCategory(null)}
              className="absolute inset-0 bg-luxury-ink/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-luxury-ink/10 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-luxury-ink/10">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">Service Management</span>
                  <h3 className="text-xl font-serif italic text-luxury-ink">Edit Category</h3>
                </div>
                <button
                  onClick={() => !isSavingCategory && setEditingCategory(null)}
                  disabled={isSavingCategory}
                  className="p-2 rounded-full hover:bg-luxury-cream text-luxury-ink/40 hover:text-luxury-ink transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategoryEdit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-1.5 font-semibold">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    placeholder="e.g. Airbrush Bridal"
                    className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-luxury-gold mb-1.5 font-semibold">
                    Brief Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={editCatDesc}
                    onChange={(e) => setEditCatDesc(e.target.value)}
                    placeholder="e.g. High-definition flawless airbrush application"
                    className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ink"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-luxury-ink/10">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    disabled={isSavingCategory}
                    className="px-5 py-2.5 rounded-full border border-luxury-ink/20 text-luxury-ink text-xs uppercase tracking-wider font-medium hover:bg-luxury-cream cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCategory}
                    className="px-6 py-2.5 rounded-full bg-luxury-ink text-white hover:bg-luxury-gold hover:text-luxury-ink text-xs uppercase tracking-wider font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSavingCategory ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Updating...
                      </>
                    ) : (
                      'Update Category'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClientDashboard = ({ email, bookings }: { email: string | null, bookings: BookingData[] }) => {
  const userBookings = bookings.filter(b => b.email === email);

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50">My Reservations</p>
          <p className="text-4xl md:text-5xl font-serif mt-2">{userBookings.length}</p>
          <p className="text-xs text-luxury-ink/40 mt-3 font-light">
            Confirmed and upcoming appointments scheduled under {email}.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-luxury-ink/50">Status</p>
          <p className="text-4xl md:text-5xl font-serif mt-2 text-luxury-gold">Active</p>
          <p className="text-xs text-luxury-ink/40 mt-3 font-light">
            Welcome to your Haus of Von bespoke client area.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 md:p-8 border border-luxury-ink/10 shadow-sm">
        <h3 className="text-xl font-serif italic mb-6">Upcoming Appointments</h3>
        {userBookings.length > 0 ? (
          <div className="divide-y divide-luxury-ink/5">
            {userBookings.map((b) => (
              <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-medium text-luxury-ink">{b.service}</h4>
                  <p className="text-xs text-luxury-ink/50">{b.date} at {b.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                  b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-luxury-ink/40 italic">
            You currently have no scheduled appointments.
          </div>
        )}
      </div>
    </div>
  );
};

export const Dashboard = ({ 
  role, 
  email, 
  onBack, 
  onLogout, 
  bookings, 
  testimonials, 
  uploadedImages,
  categories,
  customCategories,
  onOpenSOP
}: DashboardProps) => {
  return (
    <div className="min-h-screen bg-luxury-cream pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-luxury-ink/50">{role === 'admin' ? 'Management Portal' : 'Client Space'}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic mt-4">{role === 'admin' ? 'Von Beauty Admin' : 'Your client space'}</h1>
            <p className="mt-4 max-w-2xl text-sm text-luxury-ink/60 font-light">
              {role === 'admin'
                ? 'Welcome back, Von. Manage client bookings, review approvals, portfolio uploads with gender categorization, and custom makeup types.'
                : 'See your schedule, recent updates, and appointment status.'}
            </p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-luxury-ink/10 bg-white px-5 py-3 text-sm uppercase tracking-[0.35em] text-luxury-ink transition hover:border-luxury-gold hover:text-luxury-gold cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to site
          </button>
        </div>

        {role === 'admin' ? (
          <AdminDashboard 
            bookings={bookings} 
            testimonials={testimonials} 
            uploadedImages={uploadedImages}
            categories={categories}
            customCategories={customCategories}
            onOpenSOP={onOpenSOP}
            onLogout={onLogout}
          />
        ) : (
          <ClientDashboard email={email} bookings={bookings} />
        )}
      </div>
    </div>
  );
};
