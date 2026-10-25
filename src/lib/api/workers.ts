import { supabase, isDemo } from '../supabase';
import type { WorkerProfile, WorkerSearchFilters } from '../../types';
import { MOCK_WORKERS } from '../mockData';

// ── Fetch all workers (with filters) ─────────────────────────
export async function fetchWorkers(filters: WorkerSearchFilters = {}, page = 1, limit = 12) {
  if (isDemo) {
    let workers = [...MOCK_WORKERS];
    if (filters.query) workers = workers.filter(w =>
      `${w.first_name} ${w.last_name} ${w.title}`.toLowerCase().includes(filters.query!.toLowerCase())
    );
    if (filters.location) workers = workers.filter(w =>
      w.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
    if (filters.category) workers = workers.filter(w =>
      w.skills?.some(s => s.toLowerCase().includes(filters.category!.toLowerCase()))
    );
    if (filters.availability) workers = workers.filter(w => w.availability_status === filters.availability);
    if (filters.verifiedOnly) workers = workers.filter(w => w.is_premium);
    const start = (page - 1) * limit;
    return { data: workers.slice(start, start + limit), count: workers.length, error: null };
  }

  let query = supabase
    .from('worker_profiles')
    .select('*, certifications(*)', { count: 'exact' })
    .order('rating', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (filters.query) query = query.or(
    `first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,title.ilike.%${filters.query}%`
  );
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.availability) query = query.eq('availability_status', filters.availability);
  if (filters.verifiedOnly) query = query.eq('is_premium', true);
  if (filters.category) query = query.contains('skills', [filters.category]);

  const { data, count, error } = await query;
  return { data: data as WorkerProfile[], count, error };
}

// ── Fetch single worker by user_id ────────────────────────────
export async function fetchWorkerByUserId(userId: string) {
  if (isDemo) return { data: MOCK_WORKERS[0], error: null };
  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*, certifications(*)')
    .eq('user_id', userId)
    .single();
  return { data: data as WorkerProfile | null, error };
}

// ── Fetch single worker by profile id ────────────────────────
export async function fetchWorkerById(id: string) {
  if (isDemo) {
    const w = MOCK_WORKERS.find(w => w.id === id) || MOCK_WORKERS[0];
    return { data: w, error: null };
  }
  const { data, error } = await supabase
    .from('worker_profiles')
    .select('*, certifications(*)')
    .eq('id', id)
    .single();
  return { data: data as WorkerProfile | null, error };
}

// ── Update worker profile ─────────────────────────────────────
export async function updateWorkerProfile(userId: string, updates: Partial<WorkerProfile>) {
  if (isDemo) return { data: null, error: null };
  const { data, error } = await supabase
    .from('worker_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
}

// ── Upload profile photo ──────────────────────────────────────
export async function uploadProfilePhoto(userId: string, file: File) {
  if (isDemo) return { url: null, error: null };
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('elev8-media')
    .upload(path, file, { upsert: true });
  if (uploadError) return { url: null, error: uploadError };
  const { data } = supabase.storage.from('elev8-media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
