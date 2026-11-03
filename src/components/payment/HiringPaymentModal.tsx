import React, { useState } from 'react';
import { CheckCircle, X, Loader2, IndianRupee, Shield } from 'lucide-react';
import { getPlatformFee, payHiringDeposit } from '../../lib/razorpay';
import { useAuthStore } from '../../store/authStore';

interface HiringPaymentModalProps {
  workerName: string;
  jobTitle: string;
  agreedRateINR: number;
  payType: string;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

const HiringPaymentModal: React.FC<HiringPaymentModalProps> = ({
  workerName,
  jobTitle,
  agreedRateINR,
  payType,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const platformFee = getPlatformFee(agreedRateINR);

  const handlePay = async () => {
    setPaying(true);
    setError('');
    await payHiringDeposit({
      agreedRateINR,
      workerName,
      jobTitle,
      employerName: user?.email?.split('@')[0] || 'Customer',
      employerEmail: user?.email || '',
      onSuccess: (paymentId) => {
        setPaying(false);
        onSuccess(paymentId);
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
          zIndex: 99999, width: '100%', maxWidth: '460px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Confirm Hiring</h2>
            <p className="text-sm text-gray-500 mt-1">
              You're hiring <strong>{workerName}</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl p-4 mb-5" style={{ background: '#F8FAFF', border: '1px solid #E0E7FF' }}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Job</span>
              <span className="font-semibold text-gray-900">{jobTitle}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Worker</span>
              <span className="font-semibold text-gray-900">{workerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Agreed Rate</span>
              <span className="font-semibold text-gray-900">₹{agreedRateINR.toLocaleString()} / {payType}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Platform Deposit (5%)</span>
              <span className="text-lg font-bold text-indigo-700">₹{platformFee}</span>
            </div>
          </div>
        </div>

        {/* Trust note */}
        <div className="rounded-xl p-3 mb-5 flex items-start gap-2" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
          <Shield size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-800">
            This <strong>booking deposit</strong> secures your hire. Elev8 holds it safely and releases to the platform after work is confirmed complete. The main payment to the worker is paid directly.
          </p>
        </div>

        {/* What you get */}
        <ul className="space-y-1.5 mb-5">
          {[
            'Worker is notified immediately',
            'Work start time is confirmed',
            'Dispute resolution if issues arise',
            'Worker identity is verified',
          ].map(item => (
            <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

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
            className="btn btn-primary flex items-center justify-center gap-2"
            style={{ flex: 2 }}
            onClick={handlePay}
            disabled={paying}
          >
            {paying ? (
              <><Loader2 size={16} className="animate-spin" /> Processing...</>
            ) : (
              <><IndianRupee size={16} /> Pay ₹{platformFee} to Hire</>
            )}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-3">
          🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
        </p>
      </div>
    </>
  );
};

export default HiringPaymentModal;
