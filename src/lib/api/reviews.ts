import { supabase, isDemo } from '../supabase';
import type { Review } from '../../types';
import { MOCK_REVIEWS } from '../mockData';

// ── Fetch reviews for a worker ────────────────────────────────
export async function fetchWorkerReviews(workerProfileId: string) {
  if (isDemo) {
    return { data: MOCK_REVIEWS.filter(r => r.worker_id === workerProfileId), error: null };
  }
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:users(email)')
    .eq('worker_id', workerProfileId)
    .order('created_at', { ascending: false });
  return { data: data as Review[], error };
}

// ── Submit a review ───────────────────────────────────────────
export async function submitReview(payload: {
  reviewer_id: string;
  worker_id: string;
  rating: number;
  comment?: string;
  job_id?: string;
}) {
  if (isDemo) {
    const review: Review = {
      id: 'demo-' + Date.now(), ...payload,
      created_at: new Date().toISOString(),
    };
    return { data: review, error: null };
  }
  const { data, error } = await supabase
    .from('reviews')
    .insert(payload)
    .select()
    .single();
  return { data: data as Review | null, error };
}
