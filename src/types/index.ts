export type UserRole = 'worker' | 'employer' | 'admin';
export type Language = 'en' | 'hi' | 'mr';
export type AvailabilityStatus = 'available' | 'soon' | 'unavailable';
export type CertStatus = 'pending' | 'approved' | 'rejected';
export type CertType = 'partner' | 'elev8';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'emergency' | 'weekend' | 'evening';
export type PayType = 'hourly' | 'daily' | 'monthly' | 'fixed';
export type ListingType = 'business' | 'household';
export type ListingStatus = 'active' | 'expired' | 'closed';
export type ApplicationStatus = 'applied' | 'viewed' | 'shortlisted' | 'rejected' | 'hired';
export type UrgencyLevel = 'normal' | 'urgent' | 'very_urgent';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  lang_preference: Language;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  title: string;
  bio: string;
  location: string;
  city: string;
  state: string;
  hourly_rate: number;
  travel_distance: string;
  experience_level: string;
  availability_status: AvailabilityStatus;
  is_premium: boolean;
  profile_photo_url?: string;
  rating: number;
  total_reviews: number;
  skills?: string[];
  certifications?: Certification[];
  work_preferences?: string[];
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  name: string;
  company_name?: string;
  location: string;
  is_verified: boolean;
}

export interface JobListing {
  id: string;
  employer_id: string;
  type: ListingType;
  title: string;
  category: string;
  description: string;
  location: string;
  pay_rate: number;
  pay_type: PayType;
  duration?: string;
  urgency: UrgencyLevel;
  is_premium: boolean;
  status: ListingStatus;
  expires_at: string;
  created_at: string;
  required_skills?: string[];
  employer?: EmployerProfile;
  job_type?: JobType;
}

export interface JobApplication {
  id: string;
  job_id: string;
  worker_id: string;
  status: ApplicationStatus;
  applied_at: string;
  message?: string;
  job?: JobListing;
  worker?: WorkerProfile;
}

export interface Certification {
  id: string;
  worker_id: string;
  type: CertType;
  partner_name?: string;
  cert_name: string;
  cert_url?: string;
  status: CertStatus;
  verified_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  job_id?: string;
  content: string;
  is_read: boolean;
  sent_at: string;
}

export interface Conversation {
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Review {
  id: string;
  reviewer_id: string;
  worker_id: string;
  job_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer_name?: string;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  status: string;
  starts_at: string;
  expires_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  link?: string;
}

export interface SearchFilters {
  category?: string;
  jobType?: JobType[];
  payType?: PayType[];
  payMin?: number;
  payMax?: number;
  radius?: number;
  postedDate?: 'today' | 'week' | 'month';
  verifiedOnly?: boolean;
  sortBy?: 'newest' | 'highest_pay' | 'closest' | 'most_relevant';
  query?: string;
  location?: string;
}

export interface WorkerSearchFilters {
  category?: string;
  availability?: AvailabilityStatus;
  verifiedOnly?: boolean;
  query?: string;
  location?: string;
}
