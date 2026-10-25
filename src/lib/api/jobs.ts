import { supabase, isDemo } from '../supabase';
import type { JobListing, SearchFilters, JobType } from '../../types';
import { MOCK_JOBS } from '../mockData';
import { calculateDistanceKm, getCoordinatesForLocation } from '../geo';

// ── Fetch paginated job listings with location distance calculation ──
export async function fetchJobs(filters: SearchFilters = {}, page = 1, limit = 12) {
  // Determine user coordinates if provided directly or via location text
  let userCoords: { lat: number; lng: number } | null = null;
  if (filters.userLat && filters.userLng) {
    userCoords = { lat: filters.userLat, lng: filters.userLng };
  } else if (filters.location) {
    userCoords = getCoordinatesForLocation(filters.location);
  }

  if (isDemo) {
    let jobs = MOCK_JOBS.map(j => {
      let jobLat = j.lat;
      let jobLng = j.lng;
      if (!jobLat || !jobLng) {
        const coords = getCoordinatesForLocation(j.location);
        if (coords) {
          jobLat = coords.lat;
          jobLng = coords.lng;
        }
      }

      let distance: number | undefined = undefined;
      if (userCoords && jobLat && jobLng) {
        distance = calculateDistanceKm(userCoords.lat, userCoords.lng, jobLat, jobLng);
      }

      return {
        ...j,
        lat: jobLat,
        lng: jobLng,
        distance,
      };
    });

    if (filters.category) jobs = jobs.filter(j => j.category === filters.category);
    if (filters.query) jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(filters.query!.toLowerCase()) ||
      j.description.toLowerCase().includes(filters.query!.toLowerCase())
    );
    if (filters.location && !userCoords) {
      jobs = jobs.filter(j =>
        j.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Distance radius filter (e.g. 5km, 10km, 25km, 50km)
    if (filters.radius && userCoords) {
      jobs = jobs.filter(j => j.distance !== undefined && j.distance <= filters.radius!);
    }

    // Sorting
    if (filters.sortBy === 'closest') {
      jobs.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    } else if (filters.sortBy === 'highest_pay') {
      jobs.sort((a, b) => b.pay_rate - a.pay_rate);
    } else {
      jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const start = (page - 1) * limit;
    return { data: jobs.slice(start, start + limit), count: jobs.length, error: null };
  }

  let query = supabase
    .from('job_listings')
    .select(`
      *,
      employer:employer_profiles(id, name, company_name, location, is_verified, logo_url)
    `, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (filters.category) query = query.eq('category', filters.category);
  if (filters.query) query = query.ilike('title', `%${filters.query}%`);
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.payMin) query = query.gte('pay_rate', filters.payMin);
  if (filters.payMax) query = query.lte('pay_rate', filters.payMax);
  if (filters.payType && filters.payType.length > 0) query = query.in('pay_type', filters.payType);
  if (filters.sortBy === 'highest_pay') query = query.order('pay_rate', { ascending: false });

  const { data, count, error } = await query;
  
  // Calculate distance on returned Supabase records if userCoords exists
  const enrichedData = (data as JobListing[] || []).map(j => {
    let jobLat = j.lat;
    let jobLng = j.lng;
    if (!jobLat || !jobLng) {
      const coords = getCoordinatesForLocation(j.location);
      if (coords) {
        jobLat = coords.lat;
        jobLng = coords.lng;
      }
    }
    const distance = userCoords && jobLat && jobLng
      ? calculateDistanceKm(userCoords.lat, userCoords.lng, jobLat, jobLng)
      : undefined;
    return { ...j, distance };
  });

  return { data: enrichedData, count, error };
}

// ── Fetch single job ──────────────────────────────────────────
export async function fetchJobById(id: string) {
  if (isDemo) {
    const job = MOCK_JOBS.find(j => j.id === id) || null;
    return { data: job, error: null };
  }
  const { data, error } = await supabase
    .from('job_listings')
    .select(`*, employer:employer_profiles(*)`)
    .eq('id', id)
    .single();
  return { data: data as JobListing | null, error };
}

// ── Fetch employer's own jobs ─────────────────────────────────
export async function fetchEmployerJobs(employerProfileId: string) {
  if (isDemo) return { data: MOCK_JOBS.slice(0, 3), error: null };
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('employer_id', employerProfileId)
    .order('created_at', { ascending: false });
  return { data: data as JobListing[], error };
}

// ── Create job listing ────────────────────────────────────────
export async function createJob(payload: {
  employer_id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  pay_rate: number;
  pay_type: 'hourly' | 'daily' | 'monthly' | 'fixed';
  job_type?: JobType;
  duration?: string;
  type?: 'business' | 'household';
  urgency?: 'normal' | 'urgent' | 'very_urgent';
  required_skills?: string[];
}) {
  if (isDemo) {
    const mockJob: JobListing = {
      id: 'demo-' + Date.now(),
      ...payload,
      type: payload.type || 'business',
      urgency: payload.urgency || 'normal',
      is_premium: false,
      status: 'active',
      expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
    };
    return { data: mockJob, error: null };
  }
  const { data, error } = await supabase
    .from('job_listings')
    .insert(payload)
    .select()
    .single();
  return { data: data as JobListing | null, error };
}

// ── Update job listing ────────────────────────────────────────
export async function updateJob(id: string, updates: Partial<JobListing>) {
  if (isDemo) return { data: null, error: null };
  const { data, error } = await supabase
    .from('job_listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ── Delete job listing ────────────────────────────────────────
export async function deleteJob(id: string) {
  if (isDemo) return { error: null };
  const { error } = await supabase.from('job_listings').delete().eq('id', id);
  return { error };
}
