import { supabase, isDemo } from '../supabase';
import type { JobApplication } from '../../types';

const DEMO_APPS: JobApplication[] = [
  { id: 'a1', job_id: 'j1', worker_id: '1', status: 'shortlisted', applied_at: new Date().toISOString(), message: '' },
  { id: 'a2', job_id: 'j2', worker_id: '1', status: 'applied',     applied_at: new Date().toISOString(), message: '' },
  { id: 'a3', job_id: 'j3', worker_id: '1', status: 'hired',       applied_at: new Date().toISOString(), message: '' },
];

// ── Worker: submit application ────────────────────────────────
export async function applyForJob(jobId: string, workerProfileId: string, message = '') {
  if (isDemo) {
    const app: JobApplication = {
      id: 'demo-' + Date.now(), job_id: jobId,
      worker_id: workerProfileId, status: 'applied',
      applied_at: new Date().toISOString(), message,
    };
    return { data: app, error: null };
  }
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ job_id: jobId, worker_id: workerProfileId, message })
    .select()
    .single();
  return { data: data as JobApplication | null, error };
}

// ── Worker: check if already applied ─────────────────────────
export async function hasApplied(jobId: string, workerProfileId: string) {
  if (isDemo) return { applied: false, error: null };
  const { data, error } = await supabase
    .from('job_applications')
    .select('id')
    .eq('job_id', jobId)
    .eq('worker_id', workerProfileId)
    .maybeSingle();
  return { applied: !!data, error };
}

// ── Worker: get my applications ───────────────────────────────
export async function fetchWorkerApplications(workerProfileId: string) {
  if (isDemo) {
    return { data: DEMO_APPS, error: null };
  }
  const { data, error } = await supabase
    .from('job_applications')
    .select(`*, job:job_listings(*, employer:employer_profiles(name, company_name, location, is_verified))`)
    .eq('worker_id', workerProfileId)
    .order('applied_at', { ascending: false });
  return { data: data as JobApplication[], error };
}

// ── Employer: get applications for a job ─────────────────────
export async function fetchJobApplications(jobId: string) {
  if (isDemo) return { data: [], error: null };
  const { data, error } = await supabase
    .from('job_applications')
    .select(`*, worker:worker_profiles(*, certifications(*))`)
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });
  return { data: data as JobApplication[], error };
}

// ── Employer: update application status ──────────────────────
export async function updateApplicationStatus(
  applicationId: string,
  status: 'viewed' | 'shortlisted' | 'hired' | 'rejected'
) {
  if (isDemo) return { error: null };
  const { error } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId);
  return { error };
}
