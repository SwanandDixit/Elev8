import React, { useState, useRef } from 'react';
import { 
  CheckCircle, Zap, ChevronRight, ChevronLeft, 
  Camera, Upload, MapPin, Shield, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceEstimator from '../components/negotiation/PriceEstimator';
import { getPriceEstimate } from '../lib/pricing';
import type { UrgencyLevel, PayType } from '../types';

const CATEGORIES = [
  { id: 'electrician', icon: '⚡', label: 'Electrician' },
  { id: 'plumber',     icon: '🔧', label: 'Plumber' },
  { id: 'carpenter',   icon: '🪚', label: 'Carpenter' },
  { id: 'cook',        icon: '👨‍🍳', label: 'Cook' },
  { id: 'cleaning',    icon: '🧹', label: 'Cleaning' },
  { id: 'driver',      icon: '🚗', label: 'Driver' },
  { id: 'security',    icon: '🔒', label: 'Security' },
  { id: 'painter',     icon: '🎨', label: 'Painter' },
  { id: 'welder',      icon: '🔥', label: 'Welder' },
  { id: 'mason',       icon: '🧱', label: 'Mason' },
  { id: 'acTech',      icon: '❄️', label: 'AC Technician' },
  { id: 'gardener',    icon: '🌿', label: 'Gardener' },
];

const PAY_TYPES: { id: PayType; label: string }[] = [
  { id: 'hourly',  label: 'Per Hour' },
  { id: 'daily',   label: 'Per Day' },
  { id: 'monthly', label: 'Per Month' },
  { id: 'fixed',   label: 'Fixed Price' },
];

const URGENCY_OPTIONS: { id: UrgencyLevel; label: string; desc: string; icon: string; extra: number }[] = [
  { id: 'normal',     label: 'Normal',        desc: 'Within a few days',    icon: '🟢', extra: 0 },
  { id: 'urgent',     label: 'Urgent',        desc: 'Within 24 hours',      icon: '🟡', extra: 20 },
  { id: 'very_urgent',label: 'Emergency',     desc: 'Right now / ASAP',     icon: '🔴', extra: 40 },
];

const STEPS = ['Job Type', 'Details', 'Budget & Pricing', 'Your Profile', 'Review'];

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
          i < current ? 'bg-green-500 text-white' :
          i === current ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-400'
        }`} style={i === current ? { background: 'var(--gradient-primary)' } : {}}>
          {i < current ? <CheckCircle size={14} /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`flex-1 h-0.5 rounded transition-all ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

const PostRequirement: React.FC = () => {
  const [step, setStep] = useState(0);
  const [posted, setPosted] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    listingType: 'household' as 'business' | 'household',
    category: '',
    title: '',
    description: '',
    customerDescription: '',
    location: '',
    payRate: '',
    payType: 'daily' as PayType,
    duration: '1',
    urgency: 'normal' as UrgencyLevel,
    skills: '',
    additionalReqs: '',
    budgetFlexible: false,
    allowNegotiation: true,
    customerPhotoUrl: '',
    plan: 'standard' as 'standard' | 'premium',
  });

  const update = (k: keyof typeof form, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);
  const estimate = form.category ? getPriceEstimate(form.category, form.urgency) : null;
  const urgencyOption = URGENCY_OPTIONS.find(u => u.id === form.urgency)!;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update('customerPhotoUrl', url);
  };

  const handleSubmit = () => {
    setPosted(true);
  };

  if (posted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
        <div className="card max-w-md w-full text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posted! 🎉</h2>
          <p className="text-gray-500 mb-2">
            Your requirement has been posted. Workers near <strong>{form.location}</strong> will start applying soon.
          </p>
          {form.urgency === 'very_urgent' && (
            <div className="rounded-xl p-3 mb-5" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-sm font-semibold text-red-700">🔴 Emergency job — workers are being notified immediately!</p>
              <p className="text-xs text-red-500 mt-0.5">
                Emergency surcharge of {urgencyOption.extra}% will apply to the agreed rate.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Link to="/browse-workers" className="btn btn-primary w-full">Browse Workers Directly</Link>
            <button
              onClick={() => { setPosted(false); setStep(0); }}
              className="btn btn-secondary w-full"
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <div className="container py-8 max-w-2xl">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a Job Requirement</h1>
          <p className="text-gray-500 mt-1">Find the right worker for your needs</p>
        </div>

        <StepIndicator current={step} total={STEPS.length} />

        {/* Step labels */}
        <div className="flex justify-between mb-8 -mt-4">
          {STEPS.map((s, i) => (
            <span key={s} className={`text-xs font-medium hidden sm:block ${
              i === step ? 'text-indigo-600' : i < step ? 'text-green-500' : 'text-gray-400'
            }`}>{s}</span>
          ))}
        </div>

        <div className="card">

          {/* ─── STEP 0: Job Type ─────────────────────────────────── */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold text-gray-900 mb-2">What kind of job is this?</h2>
              <p className="text-sm text-gray-500 mb-6">Choose the type and category of work needed.</p>

              {/* Listing type */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([['household', '🏠', 'Household', 'Home, personal or residential work'],
                   ['business', '🏢', 'Business', 'Office, shop or commercial work']] as const).map(([id, icon, label, desc]) => (
                  <button
                    key={id}
                    onClick={() => update('listingType', id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      form.listingType === id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-semibold text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>

              {/* Category grid */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Select Category *</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => update('category', cat.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      form.category === cat.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium text-gray-700 leading-tight">{cat.label}</div>
                  </button>
                ))}
              </div>

              {/* Urgency */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">How urgent is this? *</p>
                <div className="flex flex-col gap-2">
                  {URGENCY_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => update('urgency', opt.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        form.urgency === opt.id
                          ? opt.id === 'very_urgent' ? 'border-red-400 bg-red-50'
                          : opt.id === 'urgent' ? 'border-amber-400 bg-amber-50'
                          : 'border-green-400 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-gray-900">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                      {opt.extra > 0 && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{
                            background: opt.id === 'very_urgent' ? '#FEF2F2' : '#FFFBEB',
                            color: opt.id === 'very_urgent' ? '#DC2626' : '#D97706',
                          }}>
                          +{opt.extra}% charges
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {form.urgency === 'very_urgent' && (
                  <div className="mt-3 p-3 rounded-xl flex items-start gap-2"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                    <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-red-700">
                      <strong>Emergency pricing applies.</strong> Workers will charge a 40% premium for immediate response. 
                      This helps ensure workers prioritize your job above others.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── STEP 1: Job Details ──────────────────────────────── */}
          {step === 1 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Describe your requirement</h2>

              <div className="form-group">
                <label className="label">Job Title *</label>
                <input
                  className="input"
                  placeholder={`e.g. ${selectedCategory?.icon} ${selectedCategory?.label} needed for office`}
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label">Detailed Description *</label>
                <p className="text-xs text-gray-400 mb-1.5">
                  The more details you provide, the better proposals you'll receive
                </p>
                <textarea
                  className="textarea"
                  rows={4}
                  placeholder={`Describe the work in detail: size of space, specific problems, materials available, what you expect done, any special instructions...`}
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label flex items-center gap-1.5">
                  <Camera size={14} className="text-indigo-500" />
                  Your Situation (optional but recommended)
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Tell the worker more about your home, office, or personal situation. This helps them prepare.
                </p>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="e.g. I live in a 3BHK flat, 3rd floor. The pipe under the kitchen sink is leaking. I've already turned off the water supply..."
                  value={form.customerDescription}
                  onChange={e => update('customerDescription', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label flex items-center gap-1.5">
                  <MapPin size={14} className="text-indigo-500" />
                  Location *
                </label>
                <input
                  className="input"
                  placeholder="e.g. Andheri West, Mumbai"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label">Required Skills (comma separated)</label>
                <input
                  className="input"
                  placeholder="e.g. Commercial Wiring, Panel Installation"
                  value={form.skills}
                  onChange={e => update('skills', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ─── STEP 2: Budget & Pricing ─────────────────────────── */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Budget & Pricing</h2>
              <p className="text-sm text-gray-500 mb-4">Set a fair rate — workers will see this and can negotiate.</p>

              {/* Pay type */}
              <div className="form-group">
                <label className="label">Payment Type *</label>
                <div className="grid grid-cols-4 gap-2">
                  {PAY_TYPES.map(pt => (
                    <button
                      key={pt.id}
                      type="button"
                      onClick={() => {
                        update('payType', pt.id);
                        if (estimate) {
                          const newEst = getPriceEstimate(form.category, form.urgency);
                          update('payRate', newEst.avg_rate.toString());
                        }
                      }}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        form.payType === pt.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {pt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rate input */}
              <div className="form-group">
                <label className="label">Your Budget (₹) *</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                    <input
                      className="input pl-8"
                      type="number"
                      placeholder={estimate ? estimate.avg_rate.toString() : '500'}
                      value={form.payRate}
                      onChange={e => update('payRate', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 font-medium whitespace-nowrap">
                    per {form.payType}
                  </div>
                </div>
              </div>

              {/* Price Estimator widget */}
              {form.category && (
                <PriceEstimator
                  category={form.category}
                  urgency={form.urgency}
                  currentRate={parseFloat(form.payRate) || 0}
                  payType={form.payType}
                  duration={parseInt(form.duration) || 1}
                  onSuggestedRate={rate => update('payRate', rate.toString())}
                />
              )}

              {/* Duration */}
              {form.payType !== 'fixed' && (
                <div className="form-group">
                  <label className="label">Duration ({form.payType === 'hourly' ? 'hours' : form.payType === 'daily' ? 'days' : 'months'})</label>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    placeholder="e.g. 2"
                    value={form.duration}
                    onChange={e => update('duration', e.target.value)}
                  />
                </div>
              )}

              {/* Emergency surcharge notice */}
              {form.urgency !== 'normal' && (
                <div className="rounded-xl p-4" style={{
                  background: form.urgency === 'very_urgent' ? '#FEF2F2' : '#FFFBEB',
                  border: `1px solid ${form.urgency === 'very_urgent' ? '#FECACA' : '#FDE68A'}`
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={15} style={{ color: form.urgency === 'very_urgent' ? '#EF4444' : '#F59E0B' }} />
                    <span className="font-semibold text-sm" style={{ color: form.urgency === 'very_urgent' ? '#DC2626' : '#B45309' }}>
                      Emergency Surcharge: +{urgencyOption.extra}%
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: form.urgency === 'very_urgent' ? '#9B1C1C' : '#78350F' }}>
                    Workers responding to {form.urgency === 'very_urgent' ? 'emergency' : 'urgent'} jobs charge a premium. 
                    Your listed ₹{form.payRate || '0'} will effectively be ₹
                    {Math.round(parseFloat(form.payRate || '0') * (1 + urgencyOption.extra / 100)).toLocaleString()} for workers.
                  </p>
                </div>
              )}

              {/* Allow negotiation toggle */}
              <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Allow Price Negotiation</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Workers can propose their own rates. You'll be able to accept, counter, or decline.
                  </p>
                </div>
                <div className="toggle-switch ml-4">
                  <input
                    type="checkbox"
                    checked={form.allowNegotiation}
                    onChange={e => update('allowNegotiation', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </div>
              </label>

              {/* Budget flexible toggle */}
              <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Budget is Flexible</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Show workers your budget can be adjusted for the right person
                  </p>
                </div>
                <div className="toggle-switch ml-4">
                  <input
                    type="checkbox"
                    checked={form.budgetFlexible}
                    onChange={e => update('budgetFlexible', e.target.checked)}
                  />
                  <span className="toggle-slider" />
                </div>
              </label>
            </div>
          )}

          {/* ─── STEP 3: Customer Profile ─────────────────────────── */}
          {step === 3 && (
            <div className="animate-fade-in space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Your Profile</h2>
              <p className="text-sm text-gray-500 mb-4">
                Workers trust customers who provide photos and context. This improves your chances of getting quality applications.
              </p>

              {/* Photo upload */}
              <div className="form-group">
                <label className="label flex items-center gap-1.5">
                  <Camera size={14} className="text-indigo-500" />
                  Add a Photo of the Problem / Location (optional)
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  A photo of the issue, room, or location helps workers come prepared. This significantly increases application rates.
                </p>

                {form.customerPhotoUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={form.customerPhotoUrl}
                      alt="Job photo"
                      className="w-full max-h-48 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => update('customerPhotoUrl', '')}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoCapture}
                    />
                  </div>
                )}
              </div>

              {/* Additional context */}
              <div className="form-group">
                <label className="label">Any Additional Requirements</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="e.g. Must have own tools, must speak Hindi/English, prefer female worker, must wear uniform..."
                  value={form.additionalReqs}
                  onChange={e => update('additionalReqs', e.target.value)}
                />
              </div>

              {/* Trust indicators */}
              <div className="rounded-xl p-4" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-green-600" />
                  <span className="font-semibold text-sm text-green-800">Verified Listing Benefits</span>
                </div>
                <ul className="space-y-1">
                  {[
                    'Workers can see your verified contact details',
                    'Get 3× more applications with a photo',
                    'Elev8 holds payment until work is confirmed complete',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-green-700">
                      <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Review & Post ────────────────────────────── */}
          {step === 4 && (
            <div className="animate-fade-in space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Review & Post</h2>
              <p className="text-sm text-gray-500 mb-4">Double-check everything before your job goes live.</p>

              {/* Summary card */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid #E2E8F0' }}>
                {/* Job header */}
                <div className="p-4" style={{ background: 'var(--gradient-primary)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                      {form.listingType === 'household' ? '🏠 Household' : '🏢 Business'}
                    </span>
                    {form.urgency !== 'normal' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-400 text-white">
                        {form.urgency === 'very_urgent' ? '🔴 Emergency' : '🟡 Urgent'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-lg">{form.title || 'No title set'}</h3>
                  <p className="text-white/70 text-sm mt-0.5">
                    {selectedCategory?.icon} {selectedCategory?.label} · {form.location || 'Location not set'}
                  </p>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  {form.customerPhotoUrl && (
                    <img src={form.customerPhotoUrl} alt="Job" className="w-full h-32 object-cover rounded-xl" />
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3 text-center" style={{ background: '#EEF2FF' }}>
                      <div className="text-xs text-indigo-600 mb-0.5">Budget</div>
                      <div className="font-bold text-indigo-900">₹{parseFloat(form.payRate || '0').toLocaleString()}</div>
                      <div className="text-xs text-indigo-500">per {form.payType}</div>
                    </div>
                    {form.urgency !== 'normal' && (
                      <div className="rounded-xl p-3 text-center" style={{ background: '#FEF2F2' }}>
                        <div className="text-xs text-red-500 mb-0.5">+ Emergency</div>
                        <div className="font-bold text-red-700">+{urgencyOption.extra}%</div>
                        <div className="text-xs text-red-400">surcharge</div>
                      </div>
                    )}
                    {form.allowNegotiation && (
                      <div className="rounded-xl p-3 text-center" style={{ background: '#ECFDF5' }}>
                        <div className="text-xs text-green-600 mb-0.5">Negotiation</div>
                        <div className="font-bold text-green-700 text-sm">Allowed ✓</div>
                      </div>
                    )}
                    {form.budgetFlexible && (
                      <div className="rounded-xl p-3 text-center" style={{ background: '#FFFBEB' }}>
                        <div className="text-xs text-amber-600 mb-0.5">Budget</div>
                        <div className="font-bold text-amber-700 text-sm">Flexible</div>
                      </div>
                    )}
                  </div>

                  {form.description && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 line-clamp-3">{form.description}</p>
                    </div>
                  )}

                  {form.skills && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.skills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                          <span key={skill} className="pill text-xs">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Post button */}
              <button
                onClick={handleSubmit}
                className="btn btn-primary w-full text-base py-4"
              >
                {form.urgency === 'very_urgent' ? '🔴 Post Emergency Job Now' : '🚀 Post Job Requirement'}
              </button>

              <p className="text-xs text-center text-gray-400">
                By posting, you agree to Elev8's terms of service. Workers can see your location and contact details once you accept their application.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className={`btn btn-ghost flex items-center gap-2 ${step === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div className="text-xs text-gray-400 self-center">{step + 1} / {STEPS.length}</div>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={
                  (step === 0 && (!form.category || !form.urgency)) ||
                  (step === 1 && (!form.title || !form.description || !form.location)) ||
                  (step === 2 && !form.payRate)
                }
                className="btn btn-primary flex items-center gap-2"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequirement;
