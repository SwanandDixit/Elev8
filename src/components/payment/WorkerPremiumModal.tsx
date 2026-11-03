import React, { useState } from 'react';
import { CheckCircle, Star, X, Loader2, Crown } from 'lucide-react';
import { PREMIUM_WORKER_PLANS, payForWorkerPremium } from '../../lib/razorpay';
import { useAuthStore } from '../../store/authStore';

interface WorkerPremiumModalProps {
  onClose: () => void;
  onSuccess: (planId: string, paymentId: string) => void;
}

const WorkerPremiumModal: React.FC<WorkerPremiumModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setPaying(true);
    setError('');
    await payForWorkerPremium({
      planId: selectedPlan,
      workerName: user?.email?.split('@')[0] || 'Worker',
      workerEmail: user?.email || '',
      onSuccess: (paymentId) => {
        setPaying(false);
        onSuccess(selectedPlan, paymentId);
      },
      onFailure: () => {
        setPaying(false);
        setError('Payment was cancelled or failed. Please try again.');
      },
    });
  };

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 99998 }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff', borderRadius: '24px', padding: '32px',
          zIndex: 99999, width: '100%', maxWidth: '500px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Crown size={22} className="text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Go Premium</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Get verified, rank higher, and land more jobs faster.
        </p>

        {/* Benefits banner */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '⭐', label: 'Verified Badge' },
              { icon: '🔝', label: 'Top Search Rank' },
              { icon: '📨', label: 'Unlimited Applies' },
              { icon: '👀', label: '3× More Views' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-base">{b.icon}</span>
                <span className="text-xs font-semibold text-white">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan selector */}
        <div className="flex flex-col gap-3 mb-6">
          {PREMIUM_WORKER_PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all ${
                selectedPlan === plan.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star size={15} className={plan.highlight ? 'text-amber-500' : 'text-gray-400'} />
                  <span className="font-bold text-gray-900">{plan.label}</span>
                  {plan.highlight && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      Best Value
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-700">{plan.priceLabel}</div>
                  {plan.subLabel && (
                    <div className="text-xs font-semibold text-green-600">{plan.subLabel}</div>
                  )}
                </div>
              </div>
              <ul className="space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button className="btn btn-ghost flex-1" onClick={onClose} disabled={paying}>
            Maybe Later
          </button>
          <button
            className="btn btn-primary flex-2 flex items-center justify-center gap-2"
            style={{ flex: 2 }}
            onClick={handlePay}
            disabled={paying}
          >
            {paying
              ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
              : `👑 Upgrade — ${PREMIUM_WORKER_PLANS.find(p => p.id === selectedPlan)?.priceLabel}`
            }
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-3">
          🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
        </p>
      </div>
    </>
  );
};

export default WorkerPremiumModal;
