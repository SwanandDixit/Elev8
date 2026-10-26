import { supabase, isDemo } from '../supabase';
import type { JobApplication } from '../../types';
import { MOCK_JOBS } from '../mockData';

const DEMO_APPS_STORAGE_KEY = 'elev8_demo_applications';

const INITIAL_DEMO_APPS: JobApplication[] = [
  {
    id: 'a1',
    job_id: 'j1',
    worker_id: '1',
    status: 'shortlisted',
    applied_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    message: 'Experienced in office rewiring and commercial installations.',
    job: MOCK_JOBS.find(j => j.id === 'j1') || MOCK_JOBS[0],
  },
  {
    id: 'a2',
    job_id: 'j1b',
    worker_id: '1',
    status: 'applied',
    applied_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    message: 'Available for immediate residential wiring setup.',
    job: MOCK_JOBS.find(j => j.id === 'j1b') || MOCK_JOBS[1],
  },
  {
    id: 'a3',
    job_id: 'j3',
    worker_id: '1',
    status: 'hired',
    applied_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    message: 'Ready for full-time electrical & plumbing support.',
    job: MOCK_JOBS.find(j => j.id === 'j3') || MOCK_JOBS[2],
  },
];

function getStoredDemoApps(): JobApplication[] {
  try {
    const raw = localStorage.getItem(DEMO_APPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEMO_APPS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_APPS));
      return INITIAL_DEMO_APPS;
    }
    const parsed = JSON.parse(raw);
    // Ensure jobs are enriched with MOCK_JOBS if missing
    return parsed.map((app: JobApplication) => {
      if (!app.job && app.job_id) {
        return { ...app, job: MOCK_JOBS.find(j => j.id === app.job_id) };
      }
      return app;
    });
  } catch {
    return INITIAL_DEMO_APPS;
  }
}

function saveStoredDemoApp(app: JobApplication) {
  try {
    const current = getStoredDemoApps();
    const updated = [app, ...current.filter(a => a.id !== app.id)];
    localStorage.setItem(DEMO_APPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save demo application', err);
  }
}

// ── Worker: submit application ────────────────────────────────
export async function applyForJob(jobId: string, workerProfileId: string, message = '') {
  if (isDemo) {
    const job = MOCK_JOBS.find(j => j.id === jobId);
    const app: JobApplication = {
      id: 'demo-' + Date.now(),
      job_id: jobId,
      worker_id: workerProfileId,
      status: 'applied',
      applied_at: new Date().toISOString(),
      message,
      job: job || undefined,
    };
    saveStoredDemoApp(app);
    return { data: app, error: null };
  }
  const { data, error } = await supabase
    .from('job_applications')
    .insert({ job_id: jobId, worker_id: workerProfileId, message })
    .select(`*, job:job_listings(*, employer:employer_profiles(name, company_name, location, is_verified))`)
    .single();
  return { data: data as JobApplication | null, error };
}

// ── Worker: check if already applied ─────────────────────────
export async function hasApplied(jobId: string, workerProfileId: string) {
  if (isDemo) {
    const apps = getStoredDemoApps();
    const applied = apps.some(a => a.job_id === jobId);
    return { applied, error: null };
  }
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
    return { data: getStoredDemoApps(), error: null };
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
  if (isDemo) {
    const apps = getStoredDemoApps().filter(a => a.job_id === jobId);
    return { data: apps, error: null };
  }
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
  if (isDemo) {
    const apps = getStoredDemoApps();
    const idx = apps.findIndex(a => a.id === applicationId);
    if (idx !== -1) {
      apps[idx].status = status;
      try {
        localStorage.setItem(DEMO_APPS_STORAGE_KEY, JSON.stringify(apps));
      } catch {}
    }
    return { error: null };
  }
  const { error } = await supabase
    .from('job_applications')
    .update({ status })
    .eq('id', applicationId);
  return { error };
}
