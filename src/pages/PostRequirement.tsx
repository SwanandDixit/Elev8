import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Zap, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const CATEGORIES = ['electrician','plumber','carpenter','cook','cleaning','driver','security','painter','welder','mason','acTech','gardener'];
const PAY_TYPES = ['hourly','daily','monthly','fixed'];
const URGENCY = ['normal','urgent','veryUrgent'];

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <div className={`step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
          {i < current ? <CheckCircle size={14} /> : i + 1}
        </div>
        {i < total - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
      </React.Fragment>
    ))}
  </div>
);

const PostRequirement: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [listingType, setListingType] = useState<'business' | 'household'>('business');
  const [plan, setPlan] = useState<'standard' | 'premium'>('standard');
  const [posted, setPosted] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', category: '', description: '',
    location: '', payRate: '', payType: 'hourly', duration: '',
    skills: '', urgency: 'normal', additionalReqs: '',
  });

  const updateForm = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (posted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('postJob.successTitle')}</h2>
          <p className="text-gray-600 mb-6">{t('postJob.successDesc')}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => { setPosted(false); setStep(0); setForm({ title:'',company:'',category:'',description:'',location:'',payRate:'',payType:'hourly',duration:'',skills:'',urgency:'normal',additionalReqs:'' }); }}
              className="btn btn-primary">{t('postJob.postAnother')}</button>
            <a href="/find-work" className="btn btn-secondary">{t('postJob.viewListing')}</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('postJob.title')}</h1>
        <p className="text-gray-600 mb-6">{t('postJob.subtitle')}</p>

        <StepIndicator current={step} total={3} />

        {/* Step 1 */}
        {step === 0 && (
          <div className="card animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-5">{t('postJob.step1')} — Type & Details</h2>

            {/* Type toggle */}
            <div className="flex gap-3 mb-6">
              {(['business','household'] as const).map(type => (
                <button key={type} onClick={() => setListingType(type)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                    listingType === type ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {t(`postJob.${type}`)}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div className="form-group">
                <label className="label">{listingType === 'business' ? t('postJob.jobTitle') : t('postJob.serviceTitle')} *</label>
                <input className="input" value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="e.g. Electrician for Office" />
              </div>
              {listingType === 'business' && (
                <div className="form-group">
                  <label className="label">{t('postJob.companyName')}</label>
                  <input className="input" value={form.company} onChange={e => updateForm('company', e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="label">{t('postJob.category')} *</label>
                <select className="select" value={form.category} onChange={e => updateForm('category', e.target.value)}>
                  <option value="">{t('categories.all')}</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">{t('postJob.description')} *</label>
                <textarea className="textarea" rows={4} value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Describe the work needed..." />
                <p className="flex items-center gap-1 text-xs text-amber-600 mt-1.5">
                  <AlertCircle size={12} /> {t('postJob.noContact')}
                </p>
              </div>
              <div className="form-group">
                <label className="label">{listingType === 'household' ? t('postJob.address') : t('postJob.location')} *</label>
                <input className="input" value={form.location} onChange={e => updateForm('location', e.target.value)} placeholder="City, State" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">{listingType === 'household' ? t('postJob.budget') : t('postJob.payRate')} (₹) *</label>
                  <input className="input" type="number" value={form.payRate} onChange={e => updateForm('payRate', e.target.value)} placeholder="500" />
                </div>
                <div className="form-group">
                  <label className="label">{t('postJob.payType')}</label>
                  <select className="select" value={form.payType} onChange={e => updateForm('payType', e.target.value)}>
                    {PAY_TYPES.map(p => <option key={p} value={p}>{t(`findWork.${p}`)}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t('postJob.duration')}</label>
                <input className="input" value={form.duration} onChange={e => updateForm('duration', e.target.value)} placeholder="e.g. 3 days, 1 month, Ongoing" />
              </div>
              <div className="form-group">
                <label className="label">{t('postJob.skills')}</label>
                <input className="input" value={form.skills} onChange={e => updateForm('skills', e.target.value)} placeholder="Wiring, Installation (comma separated)" />
              </div>
              <div className="form-group">
                <label className="label">{t('postJob.urgency')}</label>
                <div className="flex gap-3">
                  {URGENCY.map(u => (
                    <button key={u} onClick={() => updateForm('urgency', u)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${
                        form.urgency === u ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-gray-200 text-gray-500'
                      }`}>
                      {t(`postJob.${u}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setStep(1)} disabled={!form.title || !form.category || !form.description}
              className="btn btn-primary w-full mt-6">
              {t('btn.next')} <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2 — Plan */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-5">{t('postJob.step2')} — Choose Plan</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Standard */}
              <div onClick={() => setPlan('standard')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${plan === 'standard' ? 'border-[#1A56DB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="font-bold text-gray-900 mb-1">{t('postJob.standardPlan')}</div>
                <div className="text-2xl font-bold text-[#1A56DB] mb-3">FREE</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  {[t('postJob.standard30days'), t('postJob.standard_matching'), t('postJob.standard_support')].map(f => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
              {/* Premium */}
              <div onClick={() => setPlan('premium')}
                className={`p-5 rounded-xl border-2 cursor-pointer transition-all relative ${plan === 'premium' ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="absolute -top-3 right-4 badge badge-premium"><Zap size={10} /> Popular</div>
                <div className="font-bold text-gray-900 mb-1">{t('postJob.premiumPlan')}</div>
                <div className="text-2xl font-bold text-amber-500 mb-3">₹299</div>
                <ul className="text-sm text-gray-600 space-y-2">
                  {[t('postJob.premium60days'), t('postJob.premium_matching'), t('postJob.premium_featured'), t('postJob.premium_support')].map(f => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle size={14} className="text-amber-500 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="btn btn-secondary flex-1"><ChevronLeft size={16} /> {t('btn.back')}</button>
              <button onClick={() => setStep(2)} className="btn btn-primary flex-1">{t('btn.next')} <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3 — Preview */}
        {step === 2 && (
          <div className="card animate-fade-in">
            <h2 className="font-semibold text-gray-900 mb-5">{t('postJob.preview')}</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{form.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-500">{form.company}</p>
                </div>
                <span className={`badge ${plan === 'premium' ? 'badge-premium' : 'badge-new'}`}>
                  {plan === 'premium' ? 'Premium' : 'Standard'}
                </span>
              </div>
              {form.category && <div className="text-sm text-gray-600">Category: {t(`categories.${form.category}`)}</div>}
              {form.description && <p className="text-sm text-gray-700">{form.description}</p>}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {form.location && <span>📍 {form.location}</span>}
                {form.payRate && <span>💰 ₹{form.payRate} {t(`findWork.${form.payType}`)}</span>}
                {form.duration && <span>⏱ {form.duration}</span>}
              </div>
              {form.skills && (
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="pill text-xs">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn btn-secondary flex-1"><ChevronLeft size={16} /> {t('btn.back')}</button>
              <button onClick={() => setPosted(true)} className="btn btn-cta flex-1">{t('postJob.confirmPost')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostRequirement;
