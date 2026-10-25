import { supabase, isDemo } from '../supabase';
import type { PriceNegotiation, NegotiationStatus } from '../../types';

// Demo mode mock negotiations
const MOCK_NEGOTIATIONS: PriceNegotiation[] = [];

// ── Start a negotiation (worker proposes a rate) ──────────────
export async function startNegotiation(payload: {
  application_id: string;
  job_id: string;
  worker_id: string;
  employer_id: string;
  original_rate: number;
  worker_proposed_rate: number;
  worker_message?: string;
}): Promise<{ data: PriceNegotiation | null; error: string | null }> {
  if (isDemo) {
    const newNeg: PriceNegotiation = {
      id: 'neg-' + Date.now(),
      ...payload,
      status: 'pending_customer',
      final_agreed_rate: undefined,
      employer_counter_rate: undefined,
      employer_message: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      offers: [
        {
          id: 'offer-1',
          negotiation_id: 'neg-' + Date.now(),
          offered_by: 'worker',
          offered_rate: payload.worker_proposed_rate,
          message: payload.worker_message,
          created_at: new Date().toISOString(),
        },
      ],
    };
    MOCK_NEGOTIATIONS.push(newNeg);
    return { data: newNeg, error: null };
  }

  const { data, error } = await supabase
    .from('negotiations')
    .insert({
      application_id: payload.application_id,
      job_id: payload.job_id,
      worker_id: payload.worker_id,
      employer_id: payload.employer_id,
      original_rate: payload.original_rate,
      worker_proposed_rate: payload.worker_proposed_rate,
      worker_message: payload.worker_message,
      status: 'pending_customer',
    })
    .select()
    .single();

  if (!error && data) {
    // Also insert first offer record
    await supabase.from('negotiation_offers').insert({
      negotiation_id: data.id,
      offered_by: 'worker',
      offered_rate: payload.worker_proposed_rate,
      message: payload.worker_message,
    });
  }

  return { data: data as PriceNegotiation | null, error: error?.message || null };
}

// ── Employer responds to negotiation ──────────────────────────
export async function respondToNegotiation(
  negotiationId: string,
  response: {
    action: 'accept' | 'reject' | 'counter';
    counter_rate?: number;
    employer_message?: string;
  }
): Promise<{ data: PriceNegotiation | null; error: string | null }> {
  const status: NegotiationStatus =
    response.action === 'accept' ? 'accepted' :
    response.action === 'reject' ? 'rejected' : 'pending_worker';

  if (isDemo) {
    const neg = MOCK_NEGOTIATIONS.find(n => n.id === negotiationId);
    if (!neg) return { data: null, error: 'Negotiation not found' };
    neg.status = status;
    neg.employer_counter_rate = response.counter_rate;
    neg.employer_message = response.employer_message;
    if (response.action === 'accept') {
      neg.final_agreed_rate = neg.worker_proposed_rate;
    }
    if (response.action === 'counter' && response.counter_rate) {
      neg.offers.push({
        id: 'offer-' + Date.now(),
        negotiation_id: negotiationId,
        offered_by: 'employer',
        offered_rate: response.counter_rate,
        message: response.employer_message,
        created_at: new Date().toISOString(),
      });
    }
    return { data: neg, error: null };
  }

  const { data, error } = await supabase
    .from('negotiations')
    .update({
      status,
      employer_counter_rate: response.counter_rate,
      employer_message: response.employer_message,
      final_agreed_rate: response.action === 'accept' ? undefined : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', negotiationId)
    .select()
    .single();

  return { data: data as PriceNegotiation | null, error: error?.message || null };
}

// ── Worker responds to employer's counter ─────────────────────
export async function workerRespondToCounter(
  negotiationId: string,
  action: 'accept' | 'reject' | 'counter',
  counterRate?: number,
  message?: string
): Promise<{ data: PriceNegotiation | null; error: string | null }> {
  const status: NegotiationStatus =
    action === 'accept' ? 'accepted' :
    action === 'reject' ? 'rejected' : 'pending_customer';

  if (isDemo) {
    const neg = MOCK_NEGOTIATIONS.find(n => n.id === negotiationId);
    if (!neg) return { data: null, error: 'Not found' };
    neg.status = status;
    if (action === 'accept') {
      neg.final_agreed_rate = neg.employer_counter_rate || neg.worker_proposed_rate;
    }
    if (action === 'counter' && counterRate) {
      neg.worker_proposed_rate = counterRate;
      neg.worker_message = message;
      neg.offers.push({
        id: 'offer-' + Date.now(),
        negotiation_id: negotiationId,
        offered_by: 'worker',
        offered_rate: counterRate,
        message,
        created_at: new Date().toISOString(),
      });
    }
    return { data: neg, error: null };
  }

  const { data, error } = await supabase
    .from('negotiations')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', negotiationId)
    .select()
    .single();

  return { data: data as PriceNegotiation | null, error: error?.message || null };
}

// ── Fetch negotiations for a job ──────────────────────────────
export async function fetchNegotiationsForJob(jobId: string) {
  if (isDemo) {
    return { data: MOCK_NEGOTIATIONS.filter(n => n.job_id === jobId), error: null };
  }
  const { data, error } = await supabase
    .from('negotiations')
    .select('*, offers:negotiation_offers(*)')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  return { data: data as PriceNegotiation[], error };
}

// ── Fetch negotiation for an application ─────────────────────
export async function fetchNegotiationForApplication(applicationId: string) {
  if (isDemo) {
    return { data: MOCK_NEGOTIATIONS.find(n => n.application_id === applicationId) || null, error: null };
  }
  const { data, error } = await supabase
    .from('negotiations')
    .select('*, offers:negotiation_offers(*)')
    .eq('application_id', applicationId)
    .maybeSingle();
  return { data: data as PriceNegotiation | null, error };
}
