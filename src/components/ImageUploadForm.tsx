import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Upload, X, ChevronDown } from 'lucide-react';
import { UploadedImage, ServiceCategory } from '../types';

interface ImageUploadFormProps {
  onUpload: (images: UploadedImage[]) => void;
  onRemove: (id: string) => void;
  uploadedImages: UploadedImage[];
  title?: string;
  description?: string;
}

export const ImageUploadForm = ({ 
  onUpload, 
  onRemove, 
  uploadedImages, 
  title = "Add to Collection", 
  description = "JPG · PNG · WEBP · GIF · up to 10MB" 
}: ImageUploadFormProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Event Makeup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: ServiceCategory[] = [
    'Event Makeup',
    'Pageant Makeup',
    'Photoshoot Makeup',
    'Bridal Makeup',
    'Transformation'
  ];

  const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_SIZE_MB = 10;

  const processFiles = useCallback((files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    const valid: UploadedImage[] = [];
    let errorMsg: string | null = null;

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errorMsg = `"${file.name}" is not a supported format. Use JPG, PNG, WEBP, or GIF.`;
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errorMsg = `"${file.name}" exceeds ${MAX_SIZE_MB}MB. Please compress it first.`;
        continue;
      }
      const src = URL.createObjectURL(file);
      valid.push({ 
        id: crypto.randomUUID(), 
        src, 
        file,
        category: selectedCategory 
      });
    }

    if (errorMsg) setUploadError(errorMsg);
    if (valid.length > 0) {
      onUpload(valid);
    }
  }, [selectedCategory, onUpload]);

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
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-serif italic">{title}</h3>
        <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-luxury-ink/40 mt-1">
          {description}
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-[10px] uppercase tracking-[0.3em] text-luxury-gold mb-2 ml-1">
          Select Service Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ServiceCategory)}
            className="w-full bg-white border border-luxury-ink/10 rounded-xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/20 transition-all font-light text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-ink/30 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-4 py-10
          ${isDragging
            ? 'border-luxury-gold bg-luxury-gold/5 scale-[1.01]'
            : 'border-luxury-ink/15 hover:border-luxury-gold/50 hover:bg-luxury-ink/[0.02]'
          }
        `}
      >
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          ${isDragging ? 'bg-luxury-gold/15' : 'bg-luxury-ink/5'}
        `}>
          <Upload
            size={20}
            className={`transition-colors duration-300 ${isDragging ? 'text-luxury-gold' : 'text-luxury-ink/30'}`}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-luxury-ink/70">
            {isDragging ? 'Release to upload' : 'Drag & drop your photos here'}
          </p>
          <p className="text-[10px] text-luxury-ink/40 mt-1 uppercase tracking-widest">or click to browse files</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Error message */}
      {uploadError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 text-center"
        >
          {uploadError}
        </motion.p>
      )}

      {/* Uploaded previews */}
      {uploadedImages.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-luxury-ink/40 mb-3">
            Recent Uploads ({uploadedImages.length})
          </p>
          <div className="flex gap-3 flex-wrap">
            {uploadedImages.slice(-8).map((u) => (
              <div key={u.id} className="relative group">
                <img
                  src={u.src}
                  alt="Uploaded"
                  className="w-16 h-16 object-cover rounded-lg border border-luxury-ink/10"
                />
                <div className="absolute inset-0 bg-luxury-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                   <span className="text-[6px] text-white uppercase text-center px-1">{u.category}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(u.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-luxury-ink text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
