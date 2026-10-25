// Auto-generated Supabase Database types for Elev8
// Matches schema.sql exactly

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          role: 'worker' | 'employer' | 'admin';
          lang_preference: 'en' | 'hi' | 'mr';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone?: string | null;
          role: 'worker' | 'employer' | 'admin';
          lang_preference?: 'en' | 'hi' | 'mr';
        };
        Update: {
          phone?: string | null;
          lang_preference?: 'en' | 'hi' | 'mr';
          updated_at?: string;
        };
      };
      worker_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          title: string;
          bio: string;
          city: string;
          state: string;
          location: string;
          hourly_rate: number;
          travel_distance: string;
          experience_level: string;
          availability_status: 'available' | 'soon' | 'unavailable';
          work_preferences: string[];
          skills: string[];
          profile_photo_url: string | null;
          is_premium: boolean;
          rating: number;
          total_reviews: number;
          profile_views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name?: string;
          last_name?: string;
          title?: string;
          bio?: string;
          city?: string;
          state?: string;
          location?: string;
          hourly_rate?: number;
          availability_status?: 'available' | 'soon' | 'unavailable';
          skills?: string[];
          work_preferences?: string[];
        };
        Update: {
          first_name?: string;
          last_name?: string;
          title?: string;
          bio?: string;
          city?: string;
          state?: string;
          location?: string;
          hourly_rate?: number;
          travel_distance?: string;
          experience_level?: string;
          availability_status?: 'available' | 'soon' | 'unavailable';
          work_preferences?: string[];
          skills?: string[];
          profile_photo_url?: string | null;
        };
      };
      employer_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          company_name: string | null;
          description: string;
          location: string;
          logo_url: string | null;
          is_verified: boolean;
          total_listings: number;
          total_hires: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name?: string;
          company_name?: string | null;
          description?: string;
          location?: string;
        };
        Update: {
          name?: string;
          company_name?: string | null;
          description?: string;
          location?: string;
          logo_url?: string | null;
        };
      };
      job_listings: {
        Row: {
          id: string;
          employer_id: string;
          type: 'business' | 'household';
          title: string;
          category: string;
          description: string;
          location: string;
          pay_rate: number;
          pay_type: 'hourly' | 'daily' | 'monthly' | 'fixed';
          job_type: string | null;
          duration: string | null;
          urgency: 'normal' | 'urgent' | 'very_urgent';
          required_skills: string[];
          is_premium: boolean;
          status: 'active' | 'paused' | 'filled' | 'expired';
          applicant_count: number;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employer_id: string;
          type?: 'business' | 'household';
          title: string;
          category: string;
          description?: string;
          location: string;
          pay_rate: number;
          pay_type?: 'hourly' | 'daily' | 'monthly' | 'fixed';
          job_type?: string | null;
          duration?: string | null;
          urgency?: 'normal' | 'urgent' | 'very_urgent';
          required_skills?: string[];
        };
        Update: {
          title?: string;
          description?: string;
          location?: string;
          pay_rate?: number;
          pay_type?: 'hourly' | 'daily' | 'monthly' | 'fixed';
          job_type?: string | null;
          duration?: string | null;
          urgency?: 'normal' | 'urgent' | 'very_urgent';
          required_skills?: string[];
          status?: 'active' | 'paused' | 'filled' | 'expired';
        };
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          worker_id: string;
          status: 'applied' | 'viewed' | 'shortlisted' | 'hired' | 'rejected';
          message: string;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          job_id: string;
          worker_id: string;
          message?: string;
        };
        Update: {
          status?: 'applied' | 'viewed' | 'shortlisted' | 'hired' | 'rejected';
        };
      };
      certifications: {
        Row: {
          id: string;
          worker_id: string;
          type: 'partner' | 'elev8';
          partner_name: string;
          cert_name: string;
          cert_url: string;
          status: 'pending' | 'approved' | 'rejected';
          verified_at: string | null;
          created_at: string;
        };
        Insert: {
          worker_id: string;
          type?: 'partner' | 'elev8';
          partner_name?: string;
          cert_name: string;
          cert_url?: string;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          verified_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          job_id: string | null;
          content: string;
          is_read: boolean;
          sent_at: string;
        };
        Insert: {
          sender_id: string;
          receiver_id: string;
          job_id?: string | null;
          content: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          worker_id: string;
          job_id: string | null;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          reviewer_id: string;
          worker_id: string;
          job_id?: string | null;
          rating: number;
          comment?: string;
        };
        Update: Record<string, never>;
      };
      saved_jobs: {
        Row: { id: string; worker_id: string; job_id: string; saved_at: string };
        Insert: { worker_id: string; job_id: string };
        Update: Record<string, never>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string;
        };
        Update: { is_read?: boolean };
      };
    };
  };
};
