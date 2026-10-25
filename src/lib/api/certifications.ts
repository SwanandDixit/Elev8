import { supabase, isDemo } from '../supabase';
import type { Certification } from '../../types';

// ── Fetch worker certifications ───────────────────────────────
export async function fetchCertifications(workerProfileId: string) {
  if (isDemo) return { data: [], error: null };
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .eq('worker_id', workerProfileId)
    .order('created_at', { ascending: false });
  return { data: data as Certification[], error };
}

// ── Submit certification ──────────────────────────────────────
export async function submitCertification(payload: {
  worker_id: string;
  cert_name: string;
  type?: 'partner' | 'elev8';
  partner_name?: string;
  cert_url?: string;
}) {
  if (isDemo) {
    const cert: Certification = {
      id: 'demo-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      ...payload,
      type: payload.type || 'elev8',
    };
    return { data: cert, error: null };
  }
  const { data, error } = await supabase
    .from('certifications')
    .insert(payload)
    .select()
    .single();
  return { data: data as Certification | null, error };
}

// ── Upload certification document ─────────────────────────────
export async function uploadCertDocument(workerProfileId: string, file: File) {
  if (isDemo) return { url: null, error: null };
  const ext = file.name.split('.').pop();
  const path = `certifications/${workerProfileId}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from('elev8-media')
    .upload(path, file);
  if (uploadError) return { url: null, error: uploadError };
  const { data } = supabase.storage.from('elev8-media').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

// ── Admin: approve or reject certification ────────────────────
export async function updateCertificationStatus(
  certId: string,
  status: 'approved' | 'rejected'
) {
  if (isDemo) return { error: null };
  const { error } = await supabase
    .from('certifications')
    .update({
      status,
      verified_at: status === 'approved' ? new Date().toISOString() : null,
    })
    .eq('id', certId);
  return { error };
}
