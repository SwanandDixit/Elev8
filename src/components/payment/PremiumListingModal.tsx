import React, { useState } from 'react';
import { CheckCircle, Zap, Star, Shield, X, Loader2 } from 'lucide-react';
import { PREMIUM_LISTING_PLANS, payForPremiumListing } from '../../lib/razorpay';
import { useAuthStore } from '../../store/authStore';

interface PremiumListingModalProps {
  jobTitle: string;
  onClose: () => void;
  onSuccess: (planId: string, paymentId: string) => void;
}

const PremiumListingModal: React.FC<PremiumListingModalProps> = ({ jobTitle, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    const plan = PREMIUM_LISTING_PLANS.find(p => p.id === selectedPlan);
    if (!plan) return;

    // Free plan — no payment needed
    if (plan.price === 0) {
      onSuccess('standard', 'free');
      return;
    }

    setPaying(true);
    setError('');
    await payForPremiumListing({
      planId: selectedPlan,
      employerName: user?.email?.split('@')[0] || 'Customer',
      employerEmail: user?.email || '',
      jobTitle,
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
          zIndex: 99999, width: '100%', maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Boost Your Job Listing</h2>
            <p className="text-sm text-gray-500 mt-1">
              Get more applications faster for <strong>"{jobTitle}"</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {PREMIUM_LISTING_PLANS.map(plan => (
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
                  {plan.id === 'standard' && <Shield size={16} className="text-gray-400" />}
                  {plan.id === 'premium' && <Star size={16} className="text-amber-500" />}
                  {plan.id === 'emergency' && <Zap size={16} className="text-red-500" />}
                  <span className="font-bold text-gray-900">{plan.label}</span>
                  {plan.highlight && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                      Popular
                    </span>
                  )}
                </div>
                <span className="font-bold text-indigo-700 text-lg">{plan.priceLabel}</span>
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
            Cancel
          </button>
          <button
            className="btn btn-primary flex-2 flex items-center justify-center gap-2"
            style={{ flex: 2 }}
            onClick={handlePay}
            disabled={paying}
          >
            {paying
              ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
              : selectedPlan === 'standard'
                ? '🚀 Post for Free'
                : `💳 Pay ${PREMIUM_LISTING_PLANS.find(p => p.id === selectedPlan)?.priceLabel}`
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

export default PremiumListingModal;
