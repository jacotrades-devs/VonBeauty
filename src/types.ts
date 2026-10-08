export type UserRole = 'guest' | 'client' | 'admin';

export type GenderTag = 'Female' | 'Male' | 'Gender-Inclusive';

export type ServiceCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  disabled?: boolean;
  isCore?: boolean;
  isProtected?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface UploadedImage {
  id: string;
  imageUrl?: string;
  src: string;
  storagePath?: string;
  categoryId?: string;
  categoryName?: string;
  category: ServiceCategory;
  lookName?: string;
  title?: string;
  demographic?: GenderTag;
  gender?: GenderTag;
  isHidden?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface BookingData {
  id: string;
  name: string;
  email: string;
  service: ServiceCategory;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  notes?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  image: string;
  status: 'pending' | 'approved';
}
