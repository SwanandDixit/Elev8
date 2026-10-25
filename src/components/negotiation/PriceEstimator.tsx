import React, { useState } from 'react';
import { TrendingUp, Info, Zap } from 'lucide-react';
import { getPriceEstimate, evaluateRate, calculateTotalCost } from '../../lib/pricing';
import type { UrgencyLevel, PayType } from '../../types';

interface PriceEstimatorProps {
  category: string;
  urgency: UrgencyLevel;
  currentRate: number;
  payType: PayType;
  duration?: number;
  onSuggestedRate?: (rate: number) => void;
  compact?: boolean;
}

const PriceEstimator: React.FC<PriceEstimatorProps> = ({
  category,
  urgency,
  currentRate,
  payType,
  duration = 1,
  onSuggestedRate,
  compact = false,
}) => {
  const [showDetails, setShowDetails] = useState(!compact);
  
  const estimate = getPriceEstimate(category, urgency);
  const evaluation = currentRate > 0 ? evaluateRate(currentRate, category, urgency) : null;
  const total = currentRate > 0 && duration > 0 ? calculateTotalCost(currentRate, payType, duration, urgency) : null;

  const verdictColor = !evaluation ? 'gray' :
    evaluation.verdict === 'low' ? 'red' :
    evaluation.verdict === 'high' ? 'amber' : 'green';

  const verdictStyles = {
    green: { bg: '#ECFDF5', border: '#A7F3D0', text: '#059669', icon: '✓' },
    amber: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', icon: '↑' },
    red:   { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', icon: '↓' },
    gray:  { bg: '#F8FAFC', border: '#E2E8F0', text: '#64748B', icon: '~' },
  }[verdictColor];

  // Percentage relative to average
  const pctVsAvg = currentRate > 0 && estimate.avg_rate > 0
    ? Math.round(((currentRate - estimate.avg_rate) / estimate.avg_rate) * 100)
    : 0;

  const barWidth = estimate.max_rate > 0
    ? Math.min(100, (currentRate / (estimate.max_rate * 1.2)) * 100)
    : 0;
  const minBarWidth = (estimate.min_rate / (estimate.max_rate * 1.2)) * 100;
  const maxBarWidth = (estimate.max_rate / (estimate.max_rate * 1.2)) * 100;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${verdictStyles.border}`, background: verdictStyles.bg }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => compact && setShowDetails(v => !v)}
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={16} style={{ color: verdictStyles.text }} />
          <span className="text-sm font-semibold" style={{ color: verdictStyles.text }}>
            Price Estimator
          </span>
          {urgency === 'very_urgent' && (
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: '#FEF2F2', color: '#EF4444' }}>
              <Zap size={10} /> +{estimate.emergency_surcharge_pct}% Emergency
            </span>
          )}
        </div>
        {evaluation && (
          <span className="text-xs font-bold" style={{ color: verdictStyles.text }}>
            {verdictStyles.icon} {evaluation.verdict.toUpperCase()}
            {pctVsAvg !== 0 && ` (${pctVsAvg > 0 ? '+' : ''}${pctVsAvg}% vs avg)`}
          </span>
        )}
      </div>

      {showDetails && (
        <div className="px-4 pb-4 space-y-3">
          {/* Market Range Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>₹{estimate.min_rate.toLocaleString()} min</span>
              <span className="font-semibold text-gray-700">₹{estimate.avg_rate.toLocaleString()} avg</span>
              <span>₹{estimate.max_rate.toLocaleString()} max</span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/60">
              {/* Market range highlight */}
              <div
                className="absolute h-full rounded-full opacity-30"
                style={{
                  left: `${minBarWidth}%`,
                  width: `${maxBarWidth - minBarWidth}%`,
                  background: verdictStyles.text,
                }}
              />
              {/* Current rate indicator */}
              {currentRate > 0 && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-all duration-300"
                  style={{
                    left: `${Math.min(96, barWidth)}%`,
                    background: verdictStyles.text,
                  }}
                />
              )}
            </div>
          </div>

          {/* Verdict message */}
          {evaluation && (
            <p className="text-xs" style={{ color: verdictStyles.text }}>{evaluation.message}</p>
          )}

          {/* Market note */}
          {estimate.note && (
            <div className="flex items-start gap-1.5">
              <Info size={13} style={{ color: verdictStyles.text }} className="mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500">{estimate.note}</p>
            </div>
          )}

          {/* Total cost estimate */}
          {total && duration > 1 && (
            <div className="rounded-lg p-2.5 bg-white/70">
              <p className="text-xs text-gray-500 mb-0.5">Estimated Total ({duration} {payType})</p>
              <p className="text-base font-bold text-gray-900">₹{total.total.toLocaleString()}</p>
              {total.surcharge > 0 && (
                <p className="text-xs text-red-500">Includes ₹{total.surcharge.toLocaleString()} emergency surcharge</p>
              )}
            </div>
          )}

          {/* Quick pick buttons */}
          {onSuggestedRate && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSuggestedRate(estimate.min_rate)}
                className="flex-1 text-xs py-1.5 px-2 rounded-lg border font-medium transition-colors hover:bg-white"
                style={{ borderColor: verdictStyles.border, color: verdictStyles.text }}
              >
                ₹{estimate.min_rate.toLocaleString()} Min
              </button>
              <button
                type="button"
                onClick={() => onSuggestedRate(estimate.avg_rate)}
                className="flex-1 text-xs py-1.5 px-2 rounded-lg font-semibold transition-colors"
                style={{ background: verdictStyles.text, color: '#fff' }}
              >
                ₹{estimate.avg_rate.toLocaleString()} Avg ⭐
              </button>
              <button
                type="button"
                onClick={() => onSuggestedRate(estimate.max_rate)}
                className="flex-1 text-xs py-1.5 px-2 rounded-lg border font-medium transition-colors hover:bg-white"
                style={{ borderColor: verdictStyles.border, color: verdictStyles.text }}
              >
                ₹{estimate.max_rate.toLocaleString()} Max
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceEstimator;
