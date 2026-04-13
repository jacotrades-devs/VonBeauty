export type UserRole = 'guest' | 'client' | 'admin';

export type ServiceCategory = 'Event Makeup' | 'Pageant Makeup' | 'Photoshoot Makeup' | 'Bridal Makeup';

export type UploadedImage = {
  id: string;
  src: string;
  file?: File;
  category: ServiceCategory;
  isHidden: boolean;
};

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
