import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, ChevronDown, CheckCircle2, Sparkles, Users, Link2, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { GenderTag } from '../types';
import { compressImageToDataUrl } from '../lib/imageUtils';

interface ImageUploadFormProps {
  title?: string;
  description?: string;
  categories?: string[];
  onUploadSuccess?: () => void;
}

export const ImageUploadForm = ({ 
  title = "Studio Media Upload", 
  description = "High-Res JPG · PNG · WEBP up to 15MB • 100% Free Storage Mode",
  categories = [
    'Bridal Makeup',
    'Event Makeup',
    'Pageant Makeup',
    'Photoshoot Makeup',
    'Transformation'
  ],
  onUploadSuccess
}: ImageUploadFormProps) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || 'Event Makeup');
  const [selectedGender, setSelectedGender] = useState<GenderTag>('Female');
  const [lookTitle, setLookTitle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE_MB = 15;

  const genderOptions: { value: GenderTag; label: string; desc: string }[] = [
    { value: 'Female', label: 'Female', desc: 'Women / Brides / Editorial Glam' },
    { value: 'Male', label: 'Male', desc: 'Men / Grooms / Grooming' },
    { value: 'Gender-Inclusive', label: 'Gender-Inclusive', desc: 'Queer / Non-Binary / Creative Drag' }
  ];

  const handleAddViaUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const trimmedUrl = imageUrlInput.trim();
      const lookName = lookTitle.trim() || `${selectedCategory} Showcase`;

      await addDoc(collection(db, 'gallery'), {
        imageUrl: trimmedUrl,
        src: trimmedUrl,
        storagePath: null,
        categoryId: selectedCategory,
        categoryName: selectedCategory,
        category: selectedCategory,
        lookName: lookName,
        title: lookName,
        demographic: selectedGender,
        gender: selectedGender,
        isHidden: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUploadSuccess(`Successfully added image to ${selectedCategory} (${selectedGender})!`);
      setImageUrlInput('');
      setLookTitle('');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error('URL add error:', err);
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
      const msg = err?.message || '';
      if (msg.includes('not found') || msg.includes('(default)')) {
        setUploadError('Firestore database not created yet in Firebase project. Please click "Create database" in Firebase Console first.');
      } else {
        setUploadError('Failed to add image. Please check your admin permissions.');
      }
    } finally {
      setUploading(false);
    }
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);
    
    const fileArray = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress(`Processing ${i + 1} of ${fileArray.length}: ${file.name}...`);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported format. Please use JPG, PNG, or WebP.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`"${file.name}" exceeds ${MAX_SIZE_MB}MB limit.`);
        continue;
      }

      try {
        // 1. Direct Free Database Storage (Default - 100% Free, No Credit Card, Zero CORS)
        // Compresses image client-side to optimized WebP/JPEG (typically 50-150KB)
        const compressed = await compressImageToDataUrl(file, 1280, 1280, 0.80);
        let finalImageUrl: string = compressed.dataUrl;
        let finalStoragePath: string | null = null;
        let storageSuccess = false;

        // Save complete metadata & image record to Firestore
        const lookName = lookTitle.trim() || `${selectedCategory} Showcase`;
        await addDoc(collection(db, 'gallery'), {
          imageUrl: finalImageUrl,
          src: finalImageUrl,
          storagePath: finalStoragePath,
          categoryId: selectedCategory,
          categoryName: selectedCategory,
          category: selectedCategory,
          lookName: lookName,
          title: lookName,
          demographic: selectedGender,
          gender: selectedGender,
          isHidden: false,
          isDirectFreeStorage: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        successCount++;
      } catch (error: any) {
        console.error('Upload error:', error);
        handleFirestoreError(error, OperationType.WRITE, 'gallery');
        const msg = error?.message || '';
        if (msg.includes('not found') || msg.includes('(default)')) {
          setUploadError('Firestore database not created yet in Firebase project. Go to Firebase Console > Firestore Database > click "Create database" (100% Free).');
        } else {
          setUploadError('Failed to process image. Please verify administrator authorization.');
        }
      }
    }

    if (successCount > 0) {
      setUploadSuccess(`Successfully added ${successCount} image(s) to ${selectedCategory} (${selectedGender})!`);
      setLookTitle('');
      if (onUploadSuccess) onUploadSuccess();
    }
    setUploading(false);
    setUploadProgress('');
  }, [selectedCategory, selectedGender, lookTitle, onUploadSuccess]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-luxury-ink/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxury-ink/5 pb-4">
        <div>
          <div className="flex items-center gap-2 text-luxury-gold text-xs uppercase tracking-widest font-medium mb-1">
            <Sparkles size={14} /> Studio Media Upload
          </div>
          <h3 className="text-xl md:text-2xl font-serif italic text-luxury-ink">{title}</h3>
          <p className="text-[10px] tracking-[0.25em] uppercase text-luxury-ink/40 mt-1">
            {description}
          </p>
        </div>

        {/* Upload Mode Switcher */}
        <div className="flex items-center bg-luxury-cream/60 p-1 rounded-xl border border-luxury-ink/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              uploadMode === 'file'
                ? 'bg-luxury-ink text-white shadow-xs'
                : 'text-luxury-ink/60 hover:text-luxury-ink'
            }`}
          >
            <Upload size={13} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              uploadMode === 'url'
                ? 'bg-luxury-ink text-white shadow-xs'
                : 'text-luxury-ink/60 hover:text-luxury-ink'
            }`}
          >
            <Link2 size={13} /> Image Link / URL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selection */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-2 font-medium">
            1. Makeup Category / Service Style
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all font-light text-sm text-luxury-ink"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-ink/30 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Look Title */}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-2 font-medium">
            2. Look Name / Client Description (Optional)
          </label>
          <input
            type="text"
            value={lookTitle}
            onChange={(e) => setLookTitle(e.target.value)}
            placeholder="e.g. Royal Bridal Glam, Sunset Runway..."
            className="w-full bg-luxury-cream/40 border border-luxury-ink/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all font-light text-sm text-luxury-ink placeholder:text-luxury-ink/30"
          />
        </div>
      </div>

      {/* Gender & Demographic Segment Selection */}
      <div>
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-3 font-medium">
          <Users size={14} /> 3. Select Target Demographic / Gender
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {genderOptions.map((opt) => {
            const isSelected = selectedGender === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedGender(opt.value)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-ink shadow-sm ring-1 ring-luxury-gold'
                    : 'border-luxury-ink/10 bg-luxury-cream/30 hover:border-luxury-gold/40 text-luxury-ink/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-luxury-ink' : 'text-luxury-ink/80'}`}>
                    {opt.label}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-luxury-gold" />}
                </div>
                <p className="text-[10px] text-luxury-ink/50 leading-tight">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* File Upload Mode or URL Input Mode */}
      {uploadMode === 'file' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!uploading) setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-4 py-10 px-6
            ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
            ${isDragging
              ? 'border-luxury-gold bg-luxury-gold/10 scale-[1.01]'
              : 'border-luxury-ink/15 hover:border-luxury-gold/50 hover:bg-luxury-gold/[0.02]'
            }
          `}
        >
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
            ${isDragging ? 'bg-luxury-gold/20' : 'bg-luxury-ink/5'}
          `}>
            {uploading ? (
              <div className="animate-spin h-6 w-6 border-2 border-luxury-gold border-t-transparent rounded-full" />
            ) : (
              <Upload
                size={22}
                className={`transition-colors duration-300 ${isDragging ? 'text-luxury-gold' : 'text-luxury-ink/40'}`}
              />
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-luxury-ink/80">
              {uploading 
                ? (uploadProgress || 'Optimizing and adding photo to portfolio...') 
                : isDragging ? 'Drop images here' : 'Drag & drop photos or click to browse'}
            </p>
            <p className="text-[10px] text-luxury-ink/40 uppercase tracking-widest">
              Assigning to {selectedCategory} • {selectedGender}
            </p>
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck size={14} /> 100% Free Mode Active (No Blaze Plan or Credit Card Required)
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            disabled={uploading}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <form onSubmit={handleAddViaUrl} className="space-y-4 rounded-2xl border border-luxury-ink/10 bg-luxury-cream/20 p-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-luxury-ink flex items-center gap-1.5">
              <ImageIcon size={14} className="text-luxury-gold" /> Direct Image Web Link / URL
            </label>
            <input
              type="url"
              required
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or https://i.imgur.com/..."
              className="w-full bg-white border border-luxury-ink/15 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all font-light text-sm text-luxury-ink placeholder:text-luxury-ink/30"
            />
            <p className="text-[11px] text-luxury-ink/50">
              Paste any public image link from Unsplash, Imgur, Cloudinary, Google, or any web hosting.
            </p>
          </div>

          {imageUrlInput && (
            <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-luxury-ink/10">
              <img
                src={imageUrlInput}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg border border-luxury-ink/10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-xs text-luxury-ink/70">
                <p className="font-medium text-luxury-ink">Preview</p>
                <p className="text-[10px] text-luxury-ink/40">Will be saved under {selectedCategory} • {selectedGender}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !imageUrlInput.trim()}
            className="w-full py-3 px-4 rounded-xl bg-luxury-ink text-white font-medium text-xs uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-ink transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {uploading ? 'Adding image...' : `Add Photo to ${selectedCategory}`}
          </button>
        </form>
      )}

      {/* Status messages */}
      {uploadError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 text-center font-medium bg-red-50 py-2.5 px-4 rounded-xl border border-red-100"
        >
          {uploadError}
        </motion.p>
      )}

      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-green-700 bg-green-50 py-3 px-4 rounded-xl border border-green-200"
        >
          <CheckCircle2 size={16} />
          <span className="text-xs font-medium">{uploadSuccess}</span>
        </motion.div>
      )}
    </div>
  );
};
