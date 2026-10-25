/**
 * Price Estimation Engine for Elev8
 * 
 * Provides market rate estimates for blue-collar services in India.
 * Used to suggest fair pricing during job posting and negotiations.
 */

import type { PriceEstimate, UrgencyLevel, PayType } from '../types';

// Market rates for Indian blue-collar services (in INR)
const PRICE_DATABASE: Record<string, { min: number; max: number; avg: number; payType: PayType; note?: string }> = {
  electrician:  { min: 300, max: 800,   avg: 500,  payType: 'daily',   note: 'For light work; commercial jobs may be higher' },
  plumber:      { min: 250, max: 700,   avg: 400,  payType: 'daily',   note: 'Leak repairs are fixed price; pipework is daily' },
  carpenter:    { min: 400, max: 900,   avg: 600,  payType: 'daily',   note: 'Custom furniture work is priced separately' },
  cook:         { min: 6000, max: 20000, avg: 12000, payType: 'monthly', note: 'Depends on meals per day and household size' },
  cleaning:     { min: 100, max: 250,   avg: 150,  payType: 'hourly',  note: 'Deep cleaning is charged more' },
  driver:       { min: 15000, max: 35000, avg: 22000, payType: 'monthly', note: 'Includes personal & corporate drivers' },
  security:     { min: 12000, max: 22000, avg: 16000, payType: 'monthly', note: 'Armed guards are significantly higher' },
  painter:      { min: 350, max: 750,   avg: 500,  payType: 'daily',   note: 'Wall prep and quality of paint affects price' },
  welder:       { min: 450, max: 1000,  avg: 650,  payType: 'daily',   note: 'Specialized welding commands premium rates' },
  mason:        { min: 400, max: 900,   avg: 600,  payType: 'daily',   note: 'Rates vary by city — metro cities are 20% higher' },
  acTech:       { min: 500, max: 1200,  avg: 800,  payType: 'fixed',   note: 'Gas refill is extra; ranges ₹400–₹800/kg' },
  gardener:     { min: 200, max: 500,   avg: 300,  payType: 'daily',   note: 'Large properties are negotiated separately' },
  // fallback
  default:      { min: 300, max: 800,   avg: 500,  payType: 'daily',   note: 'General skilled labor rate' },
};

const URGENCY_SURCHARGE: Record<UrgencyLevel, number> = {
  normal:     0,    // No surcharge
  urgent:     20,   // 20% extra
  very_urgent: 40,  // 40% extra
};

/**
 * Get price estimate for a given category and urgency level
 */
export function getPriceEstimate(category: string, urgency: UrgencyLevel = 'normal'): PriceEstimate {
  const base = PRICE_DATABASE[category] || PRICE_DATABASE.default;
  const surcharge = URGENCY_SURCHARGE[urgency];
  const multiplier = 1 + surcharge / 100;

  return {
    category,
    urgency,
    min_rate: Math.round(base.min * multiplier),
    max_rate: Math.round(base.max * multiplier),
    avg_rate: Math.round(base.avg * multiplier),
    pay_type: base.payType,
    emergency_surcharge_pct: surcharge,
    note: base.note,
  };
}

/**
 * Check if a proposed rate is fair given market data
 */
export function evaluateRate(
  proposed: number,
  category: string,
  urgency: UrgencyLevel = 'normal'
): { verdict: 'low' | 'fair' | 'high'; message: string } {
  const est = getPriceEstimate(category, urgency);

  if (proposed < est.min_rate * 0.8) {
    return {
      verdict: 'low',
      message: `This rate is below market (₹${est.min_rate}–₹${est.max_rate}/${est.pay_type}). Workers may decline.`,
    };
  }
  if (proposed > est.max_rate * 1.3) {
    return {
      verdict: 'high',
      message: `This rate is above market average. You may attract high-quality workers quickly.`,
    };
  }
  return {
    verdict: 'fair',
    message: `This is within the fair market range (₹${est.min_rate}–₹${est.max_rate}/${est.pay_type}).`,
  };
}

/**
 * Calculate total cost estimate for a job
 */
export function calculateTotalCost(
  ratePerUnit: number,
  payType: PayType,
  duration: number,   // e.g. number of hours/days/months
  urgency: UrgencyLevel = 'normal'
): { subtotal: number; surcharge: number; total: number; breakdown: string } {
  const surcharge = URGENCY_SURCHARGE[urgency];
  const subtotal = ratePerUnit * duration;
  const surchargeAmount = Math.round(subtotal * surcharge / 100);
  const total = subtotal + surchargeAmount;

  const unitLabel = payType === 'hourly' ? `${duration} hrs` :
                    payType === 'daily'  ? `${duration} days` :
                    payType === 'monthly'? `${duration} months` : 'fixed';

  let breakdown = `₹${ratePerUnit} × ${unitLabel} = ₹${subtotal.toLocaleString()}`;
  if (surchargeAmount > 0) {
    breakdown += ` + ₹${surchargeAmount.toLocaleString()} emergency surcharge (${surcharge}%)`;
  }
  breakdown += ` = ₹${total.toLocaleString()}`;

  return { subtotal, surcharge: surchargeAmount, total, breakdown };
}

/**
 * Suggest a counter-offer during negotiations
 */
export function suggestCounterOffer(
  originalRate: number,
  workerRate: number,
  category: string,
  urgency: UrgencyLevel = 'normal'
): { suggested: number; reasoning: string } {
  const est = getPriceEstimate(category, urgency);
  
  // Meet in the middle, but bias toward market average
  const midpoint = Math.round((originalRate + workerRate) / 2);
  const clampedToMarket = Math.max(est.min_rate, Math.min(midpoint, est.max_rate));
  
  return {
    suggested: clampedToMarket,
    reasoning: `Market rate: ₹${est.min_rate}–₹${est.max_rate}. Suggested counter-offer splits the difference within fair market range.`,
  };
}

/**
 * Get all categories with their base rates (for display in UI)
 */
export function getAllCategoryRates(): Array<{ category: string; estimate: PriceEstimate }> {
  return Object.keys(PRICE_DATABASE)
    .filter(k => k !== 'default')
    .map(category => ({
      category,
      estimate: getPriceEstimate(category, 'normal'),
    }));
}
