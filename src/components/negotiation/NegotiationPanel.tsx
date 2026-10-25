import React, { useState } from 'react';
import { TrendingUp, CheckCircle, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { PriceNegotiation, NegotiationStatus } from '../../types';
import { getPriceEstimate, suggestCounterOffer, evaluateRate } from '../../lib/pricing';
import { respondToNegotiation, workerRespondToCounter, startNegotiation } from '../../lib/api';

// ── Status colors & labels ───────────────────────────────────
const STATUS_CONFIG: Record<NegotiationStatus, { label: string; color: string; bg: string }> = {
  open:             { label: 'Open',              color: '#6366F1', bg: '#EEF2FF' },
  pending_customer: { label: 'Awaiting Customer', color: '#F59E0B', bg: '#FFFBEB' },
  pending_worker:   { label: 'Awaiting Worker',   color: '#3B82F6', bg: '#EFF6FF' },
  countered:        { label: 'Countered',          color: '#8B5CF6', bg: '#F5F3FF' },
  accepted:         { label: 'Agreed ✓',           color: '#10B981', bg: '#ECFDF5' },
  rejected:         { label: 'Declined',           color: '#EF4444', bg: '#FEF2F2' },
};

// ─────────────────────────────────────────────────────────────
// Main Negotiation Panel Component
// ─────────────────────────────────────────────────────────────
interface NegotiationPanelProps {
  negotiation?: PriceNegotiation | null;
  viewerRole: 'worker' | 'employer';
  jobCategory?: string;
  jobUrgency?: 'normal' | 'urgent' | 'very_urgent';
  listedRate: number;
  payType?: string;
  // For creating new negotiation (worker side)
  applicationId?: string;
  jobId?: string;
  workerId?: string;
  employerId?: string;
  onNegotiationUpdate?: (neg: PriceNegotiation) => void;
}

const NegotiationPanel: React.FC<NegotiationPanelProps> = ({
  negotiation,
  viewerRole,
  jobCategory = 'electrician',
  jobUrgency = 'normal',
  listedRate,
  payType = 'daily',
  applicationId,
  jobId,
  workerId,
  employerId,
  onNegotiationUpdate,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [counterRate, setCounterRate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'view' | 'propose' | 'counter'>('view');

  const estimate = getPriceEstimate(jobCategory, jobUrgency);
  const currentOffer = viewerRole === 'worker' 
    ? negotiation?.employer_counter_rate || negotiation?.original_rate
    : negotiation?.worker_proposed_rate;

  const rateEval = currentOffer ? evaluateRate(currentOffer, jobCategory, jobUrgency) : null;

  // ── Handle Worker Proposing a New Rate ──────────────────────
  const handlePropose = async () => {
    const rate = parseFloat(counterRate);
    if (!rate || rate <= 0) return setError('Please enter a valid rate');
    if (!applicationId || !jobId || !workerId || !employerId) return;

    setLoading(true);
    setError('');
    const { data, error: err } = await startNegotiation({
      application_id: applicationId,
      job_id: jobId,
      worker_id: workerId,
      employer_id: employerId,
      original_rate: listedRate,
      worker_proposed_rate: rate,
      worker_message: message,
    });
    setLoading(false);
    if (err) return setError(err);
    if (data) {
      onNegotiationUpdate?.(data);
      setMode('view');
      setCounterRate('');
      setMessage('');
    }
  };

  // ── Handle Employer Responding ───────────────────────────────
  const handleEmployerResponse = async (action: 'accept' | 'reject' | 'counter') => {
    if (!negotiation) return;
    const rate = action === 'counter' ? parseFloat(counterRate) : undefined;
    if (action === 'counter' && (!rate || rate <= 0)) return setError('Enter a counter rate');

    setLoading(true);
    setError('');
    const { data, error: err } = await respondToNegotiation(negotiation.id, {
      action,
      counter_rate: rate,
      employer_message: message,
    });
    setLoading(false);
    if (err) return setError(err);
    if (data) {
      onNegotiationUpdate?.(data);
      setMode('view');
      setCounterRate('');
      setMessage('');
    }
  };

  // ── Handle Worker Responding to Counter ─────────────────────
  const handleWorkerResponse = async (action: 'accept' | 'reject' | 'counter') => {
    if (!negotiation) return;
    const rate = action === 'counter' ? parseFloat(counterRate) : undefined;
    if (action === 'counter' && (!rate || rate <= 0)) return setError('Enter a counter rate');

    setLoading(true);
    setError('');
    const { data, error: err } = await workerRespondToCounter(
      negotiation.id,
      action,
      rate,
      message
    );
    setLoading(false);
    if (err) return setError(err);
    if (data) {
      onNegotiationUpdate?.(data);
      setMode('view');
    }
  };

  const getSuggestion = () => {
    if (!negotiation?.worker_proposed_rate || !negotiation?.employer_counter_rate) return null;
    return suggestCounterOffer(
      negotiation.employer_counter_rate,
      negotiation.worker_proposed_rate,
      jobCategory,
      jobUrgency
    );
  };

  const suggestion = getSuggestion();

  // ────────────────────────────────────────────────────────────
  return (
    <div className="card" style={{ border: '1.5px solid #E2E8F0' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-indigo-600" />
          <h3 className="font-bold text-gray-900">Price Negotiation</h3>
        </div>
        {negotiation && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{
            color: STATUS_CONFIG[negotiation.status].color,
            background: STATUS_CONFIG[negotiation.status].bg,
          }}>
            {STATUS_CONFIG[negotiation.status].label}
          </span>
        )}
      </div>

      {/* Market Rate Banner */}
      <div className="rounded-xl p-3 mb-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Market Rate ({jobCategory})</span>
          {jobUrgency !== 'normal' && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>
              +{estimate.emergency_surcharge_pct}% Emergency
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{estimate.min_rate.toLocaleString()} – ₹{estimate.max_rate.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">per {estimate.pay_type}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{estimate.note}</p>
      </div>

      {/* Current Rates Summary */}
      {negotiation ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl p-3 text-center" style={{ background: '#F8FAFC' }}>
            <div className="text-xs text-gray-500 mb-1">Listed Rate</div>
            <div className="font-bold text-gray-900">₹{negotiation.original_rate.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{payType}</div>
          </div>
          {negotiation.worker_proposed_rate && (
            <div className="rounded-xl p-3 text-center" style={{ background: '#EFF6FF' }}>
              <div className="text-xs text-blue-600 mb-1">Worker's Offer</div>
              <div className="font-bold text-blue-700">₹{negotiation.worker_proposed_rate.toLocaleString()}</div>
              {rateEval && (
                <div className={`text-xs mt-0.5 ${rateEval.verdict === 'low' ? 'text-red-500' : rateEval.verdict === 'high' ? 'text-amber-600' : 'text-green-600'}`}>
                  {rateEval.verdict === 'low' ? '↓ Below market' : rateEval.verdict === 'high' ? '↑ Above market' : '✓ Fair'}
                </div>
              )}
            </div>
          )}
          {negotiation.employer_counter_rate && (
            <div className="rounded-xl p-3 text-center" style={{ background: '#F5F3FF' }}>
              <div className="text-xs text-purple-600 mb-1">Counter Offer</div>
              <div className="font-bold text-purple-700">₹{negotiation.employer_counter_rate.toLocaleString()}</div>
            </div>
          )}
          {negotiation.final_agreed_rate && (
            <div className="rounded-xl p-3 text-center" style={{ background: '#ECFDF5' }}>
              <div className="text-xs text-green-600 mb-1">✓ Agreed Rate</div>
              <div className="font-bold text-green-700 text-lg">₹{negotiation.final_agreed_rate.toLocaleString()}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between py-3 px-4 rounded-xl mb-4"
          style={{ background: '#F8FAFC' }}>
          <div>
            <div className="text-xs text-gray-500">Listed Rate</div>
            <div className="font-bold text-gray-900">₹{listedRate.toLocaleString()} / {payType}</div>
          </div>
          {viewerRole === 'worker' && !negotiation && (
            <button
              onClick={() => setMode('propose')}
              className="btn btn-primary btn-sm"
            >
              Propose Rate
            </button>
          )}
        </div>
      )}

      {/* Suggestion banner for countering */}
      {suggestion && negotiation?.status === 'pending_worker' && viewerRole === 'worker' && (
        <div className="rounded-xl p-3 mb-4 flex items-start gap-2"
          style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Suggested Counter: ₹{suggestion.suggested.toLocaleString()}</p>
            <p className="text-xs text-amber-600">{suggestion.reasoning}</p>
          </div>
        </div>
      )}

      {/* Offer History */}
      {negotiation && negotiation.offers.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Offer History ({negotiation.offers.length})
          </button>
          {showHistory && (
            <div className="mt-2 flex flex-col gap-2">
              {negotiation.offers.map((offer) => (
                <div key={offer.id} className={`flex gap-3 ${offer.offered_by === 'worker' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-xl px-3 py-2 ${
                    offer.offered_by === 'worker'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-xs font-medium mb-0.5 opacity-80">
                      {offer.offered_by === 'worker' ? 'You (Worker)' : 'Customer'}
                    </div>
                    <div className="font-bold">₹{offer.offered_rate.toLocaleString()}</div>
                    {offer.message && <p className="text-xs mt-1 opacity-80">{offer.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg px-3 py-2 mb-3" style={{ background: '#FEF2F2', color: '#EF4444' }}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ── Worker: Propose New Rate ── */}
      {viewerRole === 'worker' && !negotiation && mode === 'propose' && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Propose your rate</p>
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                className="input pl-7"
                type="number"
                placeholder={estimate.avg_rate.toString()}
                value={counterRate}
                onChange={e => setCounterRate(e.target.value)}
              />
            </div>
            <span className="flex items-center text-sm text-gray-500 font-medium">/{payType}</span>
          </div>
          {counterRate && parseFloat(counterRate) > 0 && (
            <div className={`text-xs mb-2 px-2 py-1 rounded-lg ${
              evaluateRate(parseFloat(counterRate), jobCategory, jobUrgency).verdict === 'low'
                ? 'bg-red-50 text-red-600' 
                : 'bg-green-50 text-green-600'
            }`}>
              {evaluateRate(parseFloat(counterRate), jobCategory, jobUrgency).message}
            </div>
          )}
          <textarea
            className="textarea mb-3"
            placeholder="Briefly explain your experience and why this rate is fair..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setMode('view')}
              className="btn btn-ghost btn-sm flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePropose}
              disabled={loading}
              className="btn btn-primary btn-sm flex-1"
            >
              {loading ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
        </div>
      )}

      {/* ── Employer: Review Worker Proposal ── */}
      {viewerRole === 'employer' && negotiation?.status === 'pending_customer' && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Respond to worker's proposal</p>
          {negotiation.worker_message && (
            <div className="rounded-xl p-3 mb-3 text-sm text-gray-700" style={{ background: '#F8FAFC' }}>
              <span className="text-xs font-medium text-gray-500 block mb-1">Worker says:</span>
              {negotiation.worker_message}
            </div>
          )}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleEmployerResponse('accept')}
              disabled={loading}
              className="btn flex-1 flex items-center justify-center gap-1.5"
              style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
            >
              <CheckCircle size={15} /> Accept ₹{negotiation.worker_proposed_rate}
            </button>
            <button
              onClick={() => handleEmployerResponse('reject')}
              disabled={loading}
              className="btn flex-1 flex items-center justify-center gap-1.5"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}
            >
              <X size={15} /> Decline
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                className="input pl-7"
                type="number"
                placeholder="Counter offer"
                value={counterRate}
                onChange={e => setCounterRate(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleEmployerResponse('counter')}
              disabled={loading || !counterRate}
              className="btn btn-primary btn-sm"
            >
              Counter
            </button>
          </div>
        </div>
      )}

      {/* ── Worker: Review Counter-Offer ── */}
      {viewerRole === 'worker' && negotiation?.status === 'pending_worker' && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Customer counter-offered ₹{negotiation.employer_counter_rate?.toLocaleString()}</p>
          {suggestion && (
            <button
              onClick={() => setCounterRate(suggestion.suggested.toString())}
              className="text-xs text-indigo-600 hover:underline mb-2 block"
            >
              Use suggested counter (₹{suggestion.suggested})
            </button>
          )}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleWorkerResponse('accept')}
              disabled={loading}
              className="btn flex-1 flex items-center justify-center gap-1.5"
              style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}
            >
              <CheckCircle size={15} /> Accept ₹{negotiation.employer_counter_rate}
            </button>
            <button
              onClick={() => handleWorkerResponse('reject')}
              disabled={loading}
              className="btn flex-1 flex items-center justify-center gap-1.5"
              style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}
            >
              <X size={15} /> Decline
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input
                className="input pl-7"
                type="number"
                placeholder="Your counter"
                value={counterRate}
                onChange={e => setCounterRate(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleWorkerResponse('counter')}
              disabled={loading || !counterRate}
              className="btn btn-primary btn-sm"
            >
              Counter
            </button>
          </div>
        </div>
      )}

      {/* Agreed state */}
      {negotiation?.status === 'accepted' && (
        <div className="border-t border-gray-100 pt-4 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <p className="font-bold text-gray-900">Deal Agreed!</p>
          <p className="text-sm text-gray-500">
            Final rate: <span className="font-bold text-green-600">₹{negotiation.final_agreed_rate?.toLocaleString()} / {payType}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default NegotiationPanel;
