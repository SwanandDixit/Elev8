import { create } from 'zustand';
import { supabase, isDemo } from '../lib/supabase';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  session: unknown | null;
  role: UserRole | null;
  workerProfileId: string | null;   // worker_profiles.id
  employerProfileId: string | null; // employer_profiles.id
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

// ── Demo mode helpers ─────────────────────────────────────────
const DEMO_KEY = 'elev8_demo_user';

type DemoSession = { user: User; role: UserRole; workerProfileId: string | null; employerProfileId: string | null };

function saveDemoSession(s: DemoSession) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(s));
}
function loadDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function clearDemoSession() { localStorage.removeItem(DEMO_KEY); }

function makeDemoUser(email: string, role: UserRole, name?: string): User {
  return {
    id: 'demo-' + Date.now(),
    email,
    role,
    lang_preference: 'en',
    created_at: new Date().toISOString(),
    name: name || email.split('@')[0],
  } as User;
}

// ── Fetch profile IDs after auth ──────────────────────────────
async function fetchProfileIds(userId: string, role: UserRole) {
  let workerProfileId: string | null = null;
  let employerProfileId: string | null = null;

  if (role === 'worker') {
    const { data } = await supabase
      .from('worker_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    workerProfileId = data?.id ?? null;
  } else if (role === 'employer') {
    const { data } = await supabase
      .from('employer_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    employerProfileId = data?.id ?? null;
  }
  return { workerProfileId, employerProfileId };
}

// ── Zustand Store ─────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  workerProfileId: null,
  employerProfileId: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    // ── DEMO MODE ──
    if (isDemo) {
      const saved = loadDemoSession();
      if (saved) {
        set({ ...saved, session: 'demo', initialized: true });
      } else {
        set({ initialized: true });
      }
      return;
    }

    // ── REAL SUPABASE ──
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        const profileIds = await fetchProfileIds(session.user.id, userData.role);
        set({ session, user: userData, role: userData.role, ...profileIds, initialized: true });
      }
    } else {
      set({ initialized: true });
    }

    // Listen for auth state changes (login/logout)
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (userData) {
          const profileIds = await fetchProfileIds(session.user.id, userData.role);
          set({ session, user: userData, role: userData.role, ...profileIds });
        }
      } else {
        set({ session: null, user: null, role: null, workerProfileId: null, employerProfileId: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });

    if (isDemo) {
      // Determine role from email keywords
      let role: UserRole = 'worker';
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('admin')) {
        role = 'admin';
      } else if (lowerEmail.includes('employer') || lowerEmail.includes('customer') || lowerEmail.includes('hire')) {
        role = 'employer';
      }
      const user = makeDemoUser(email, role);
      const session: DemoSession = {
        user, role,
        workerProfileId: role === 'worker' ? 'demo-wp-1' : null,
        employerProfileId: role === 'employer' ? 'demo-ep-1' : null,
      };
      saveDemoSession(session);
      set({ ...session, session: 'demo', loading: false });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    if (error) throw error;
  },

  signUp: async (email, password, role, name) => {
    set({ loading: true });

    if (isDemo) {
      const user = makeDemoUser(email, role, name);
      const session: DemoSession = {
        user, role,
        workerProfileId: role === 'worker' ? 'demo-wp-1' : null,
        employerProfileId: role === 'employer' ? 'demo-ep-1' : null,
      };
      saveDemoSession(session);
      set({ ...session, session: 'demo', loading: false });
      return;
    }

    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { set({ loading: false }); throw error; }

    if (data.user) {
      // 2. Insert into public.users
      const { error: userError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        role,
        lang_preference: 'en',
      });
      if (userError) { set({ loading: false }); throw userError; }

      // 3. Create role profile — trigger handles this, but we do it explicitly too
      if (role === 'worker') {
        await supabase.from('worker_profiles').upsert({
          user_id: data.user.id,
          first_name: name?.split(' ')[0] || '',
          last_name: name?.split(' ').slice(1).join(' ') || '',
        });
      } else if (role === 'employer') {
        await supabase.from('employer_profiles').upsert({
          user_id: data.user.id,
          name: name || '',
        });
      }
    }

    set({ loading: false });
  },

  signInWithGoogle: async () => {
    if (isDemo) {
      const user = makeDemoUser('demo@google.com', 'worker', 'Google User');
      const session: DemoSession = {
        user, role: 'worker',
        workerProfileId: 'demo-wp-1',
        employerProfileId: null,
      };
      saveDemoSession(session);
      set({ ...session, session: 'demo', loading: false });
      window.location.href = '/dashboard/worker';
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard/worker' },
    });
  },

  signOut: async () => {
    if (isDemo) {
      clearDemoSession();
    } else {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, role: null, workerProfileId: null, employerProfileId: null });
  },
}));
