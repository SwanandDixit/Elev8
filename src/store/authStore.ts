import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types';

// Check if we have real Supabase credentials
const isDemo = !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co';

interface AuthState {
  user: User | null;
  session: unknown | null;
  role: UserRole | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

// Helper: persist demo user to localStorage
const DEMO_KEY = 'elev8_demo_user';

function saveDemoUser(user: User, role: UserRole) {
  localStorage.setItem(DEMO_KEY, JSON.stringify({ user, role }));
}

function loadDemoUser(): { user: User; role: UserRole } | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function clearDemoUser() {
  localStorage.removeItem(DEMO_KEY);
}

function makeDemoUser(email: string, role: UserRole, name?: string): User {
  return {
    id: 'demo-' + Date.now(),
    email,
    role,
    lang_preference: 'en',
    created_at: new Date().toISOString(),
    // Extra fields the UI may reference
    name: name || email.split('@')[0],
  } as User;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    if (isDemo) {
      // Demo mode — check localStorage for saved session
      const saved = loadDemoUser();
      if (saved) {
        set({ user: saved.user, role: saved.role, session: 'demo', initialized: true });
      } else {
        set({ initialized: true });
      }
      return;
    }

    // Real Supabase flow
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      set({ session, user: userData, role: userData?.role, initialized: true });
    } else {
      set({ initialized: true });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set({ session, user: userData, role: userData?.role });
      } else {
        set({ session: null, user: null, role: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });

    if (isDemo) {
      // Demo: accept any credentials
      const saved = loadDemoUser();
      const user = saved?.user || makeDemoUser(email, 'worker');
      const role = saved?.role || 'worker';
      saveDemoUser(user, role);
      set({ user, role, session: 'demo', loading: false });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) throw error;
  },

  signUp: async (email, password, role, name) => {
    set({ loading: true });

    if (isDemo) {
      // Demo: create a mock user and save
      const user = makeDemoUser(email, role, name);
      saveDemoUser(user, role);
      set({ user, role, session: 'demo', loading: false });
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { set({ loading: false }); throw error; }
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        role,
        lang_preference: 'en',
      });
      if (role === 'employer' && name) {
        await supabase.from('employer_profiles').insert({
          user_id: data.user.id,
          name,
          location: '',
          is_verified: false,
        });
      }
    }
    set({ loading: false });
  },

  signInWithGoogle: async () => {
    if (isDemo) {
      const user = makeDemoUser('demo@google.com', 'worker', 'Google User');
      saveDemoUser(user, 'worker');
      set({ user, role: 'worker', session: 'demo', loading: false });
      window.location.href = '/dashboard/worker';
      return;
    }
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  },

  signOut: async () => {
    if (isDemo) {
      clearDemoUser();
    } else {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, role: null });
  },
}));
