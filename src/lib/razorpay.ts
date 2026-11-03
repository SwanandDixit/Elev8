/**
 * Razorpay Payment Integration for Elev8
 *
 * Handles three payment scenarios:
 *  1. Employer hiring a worker — Platform booking deposit (5% of agreed rate)
 *  2. Employer posting a Premium / Urgent job — Priority listing fee
 *  3. Worker upgrading to Premium profile — Monthly/annual subscription
 */

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

/** Lazily load the Razorpay SDK script only when needed */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentOptions {
  amount: number;          // Amount in paise (₹1 = 100 paise)
  currency?: string;       // Default: INR
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onFailure?: (error: RazorpayErrorResponse) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    reason: string;
  };
}

/** Open Razorpay checkout */
export async function openRazorpayCheckout(opts: RazorpayPaymentOptions): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert('Failed to load payment gateway. Please check your internet connection and try again.');
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: opts.amount,
    currency: opts.currency || 'INR',
    name: opts.name || 'Elev8',
    description: opts.description || 'Payment',
    image: 'https://elev8888.netlify.app/elev8-icon.png',
    prefill: opts.prefill || {},
    notes: opts.notes || {},
    theme: { color: opts.theme?.color || '#4F46E5' },
    handler: (response: RazorpaySuccessResponse) => {
      opts.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        opts.onFailure?.({
          error: { code: 'CANCELLED', description: 'Payment cancelled by user.', reason: 'User closed the payment window.' },
        });
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (response: { error: RazorpayErrorResponse['error'] }) => {
    opts.onFailure?.({ error: response.error });
  });
  rzp.open();
}

/* ─── Predefined Payment Flows ─────────────────────────────── */

/** Platform fee for hiring a worker = 5% of agreed rate (min ₹49) */
export function getPlatformFee(agreedRateINR: number): number {
  return Math.max(49, Math.round(agreedRateINR * 0.05));
}

/** Premium job listing prices */
export const PREMIUM_LISTING_PLANS = [
  {
    id: 'standard',
    label: 'Standard',
    price: 0,
    priceLabel: 'Free',
    features: ['Listed to nearby workers', 'Basic visibility'],
    highlight: false,
  },
  {
    id: 'premium',
    label: 'Premium Listing',
    price: 299,
    priceLabel: '₹299',
    features: ['Top of search results', 'Highlighted in orange', 'Urgent badge', 'Email alerts to matched workers', '30 days active'],
    highlight: true,
  },
  {
    id: 'emergency',
    label: 'Emergency Boost',
    price: 499,
    priceLabel: '₹499',
    features: ['Everything in Premium', 'Instant SMS alerts to top 50 workers', 'Priority support', '72-hour emergency placement guarantee'],
    highlight: false,
  },
];

/** Worker Premium profile upgrade plans */
export const PREMIUM_WORKER_PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: 199,
    priceLabel: '₹199/mo',
    features: ['Verified badge', 'Top search ranking', 'Unlimited applications', 'Priority employer visibility'],
    highlight: false,
  },
  {
    id: 'yearly',
    label: 'Annual',
    price: 1499,
    priceLabel: '₹1499/yr',
    subLabel: 'Save ₹889',
    features: ['Everything in Monthly', 'Free skill certification test', 'Dedicated profile review', 'Best value for serious workers'],
    highlight: true,
  },
];

/** Pay to hire worker — booking deposit */
export async function payHiringDeposit(opts: {
  agreedRateINR: number;
  workerName: string;
  jobTitle: string;
  employerName: string;
  employerEmail: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: () => void;
}) {
  const fee = getPlatformFee(opts.agreedRateINR);
  await openRazorpayCheckout({
    amount: fee * 100,
    name: 'Elev8 Platform',
    description: `Hiring Deposit — ${opts.workerName} for "${opts.jobTitle}"`,
    prefill: { name: opts.employerName, email: opts.employerEmail },
    notes: { job_title: opts.jobTitle, worker_name: opts.workerName },
    theme: { color: '#10B981' },
    onSuccess: (res) => opts.onSuccess(res.razorpay_payment_id),
    onFailure: () => opts.onFailure?.(),
  });
}

/** Pay for premium job listing */
export async function payForPremiumListing(opts: {
  planId: string;
  employerName: string;
  employerEmail: string;
  jobTitle: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: () => void;
}) {
  const plan = PREMIUM_LISTING_PLANS.find(p => p.id === opts.planId);
  if (!plan || plan.price === 0) return opts.onSuccess('free');

  await openRazorpayCheckout({
    amount: plan.price * 100,
    name: 'Elev8 Platform',
    description: `${plan.label} — "${opts.jobTitle}"`,
    prefill: { name: opts.employerName, email: opts.employerEmail },
    notes: { plan_id: opts.planId, job_title: opts.jobTitle },
    onSuccess: (res) => opts.onSuccess(res.razorpay_payment_id),
    onFailure: () => opts.onFailure?.(),
  });
}

/** Pay for worker premium upgrade */
export async function payForWorkerPremium(opts: {
  planId: string;
  workerName: string;
  workerEmail: string;
  onSuccess: (paymentId: string) => void;
  onFailure?: () => void;
}) {
  const plan = PREMIUM_WORKER_PLANS.find(p => p.id === opts.planId);
  if (!plan) return;

  await openRazorpayCheckout({
    amount: plan.price * 100,
    name: 'Elev8 Platform',
    description: `Worker Premium — ${plan.label} Plan`,
    prefill: { name: opts.workerName, email: opts.workerEmail },
    notes: { plan_id: opts.planId, worker_email: opts.workerEmail },
    onSuccess: (res) => opts.onSuccess(res.razorpay_payment_id),
    onFailure: () => opts.onFailure?.(),
  });
}
