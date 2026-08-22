import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ChevronRight, ChevronLeft, User, Briefcase, Award, Lock } from 'lucide-react';

const CATEGORIES = ['electrician','plumber','carpenter','cook','cleaning','driver','security','painter','welder','mason','acTech','gardener'];
const EXP_LEVELS = ['exp_0_1','exp_1_3','exp_3_5','exp_5_10','exp_10plus'];
const WORK_PREFS = ['fullTime','partTime','contract','emergency','weekend','evening'];
const DIST_OPTIONS = ['dist_5','dist_10','dist_25','dist_50','dist_any'];
const AVAIL_OPTIONS = ['availableNow','availableSoon','notAvailable'];

const StepIndicator: React.FC<{ step: number }> = ({ step }) => {
  const steps = [User, Briefcase, Award, Lock];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((Icon, i) => (
        <React.Fragment key={i}>
          <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
            {i < step ? <CheckCircle size={14} /> : <Icon size={14} />}
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const RegisterWorker: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'', city:'', state:'',
    profTitle:'', expLevel:'', bio:'', primarySkill:'', skills:'',
    certs:'', hourlyRate:'', travelDist:'dist_25', availability:'availableNow',
    password:'', confirmPassword:'', premium: false, terms: false,
  });
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));
  const togglePref = (p: string) => setPrefs(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);

  const benefits = [
    t('registerWorker.benefit1'), t('registerWorker.benefit2'),
    t('registerWorker.benefit3'), t('registerWorker.benefit4'), t('registerWorker.benefit5'),
  ];
  const premiumBenefits = [
    t('registerWorker.premiumBenefit1'), t('registerWorker.premiumBenefit2'),
    t('registerWorker.premiumBenefit3'), t('registerWorker.premiumBenefit4'),
  ];

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('registerWorker.successTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('registerWorker.successDesc')}</p>
        <button onClick={() => navigate('/sign-in')} className="btn btn-primary w-full">{t('auth.signIn')}</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('registerWorker.title')}</h1>
            <p className="text-gray-600 mb-6">{t('registerWorker.subtitle')}</p>
            <StepIndicator step={step} />

            {/* Step 1 */}
            {step === 0 && (
              <div className="card animate-fade-in">
                <h2 className="font-semibold text-gray-900 mb-5">{t('registerWorker.step1')}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">{t('registerWorker.firstName')} *</label>
                    <input className="input" value={form.firstName} onChange={e=>set('firstName',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.lastName')} *</label>
                    <input className="input" value={form.lastName} onChange={e=>set('lastName',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.email')} *</label>
                    <input className="input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.phone')} *</label>
                    <input className="input" type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e=>set('phone',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.city')} *</label>
                    <input className="input" value={form.city} onChange={e=>set('city',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.state')} *</label>
                    <input className="input" value={form.state} onChange={e=>set('state',e.target.value)} />
                  </div>
                </div>
                <button onClick={() => setStep(1)}
                  disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
                  className="btn btn-primary w-full mt-5">
                  {t('btn.next')} <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <div className="card animate-fade-in">
                <h2 className="font-semibold text-gray-900 mb-5">{t('registerWorker.step2')}</h2>
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label">{t('registerWorker.title_field')} *</label>
                    <input className="input" placeholder={t('registerWorker.titlePlaceholder')} value={form.profTitle} onChange={e=>set('profTitle',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.experience')}</label>
                    <select className="select" value={form.expLevel} onChange={e=>set('expLevel',e.target.value)}>
                      <option value="">Select...</option>
                      {EXP_LEVELS.map(e => <option key={e} value={e}>{t(`registerWorker.${e}`)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.bio')}</label>
                    <textarea className="textarea" rows={4} placeholder={t('registerWorker.bioPlaceholder')} value={form.bio} onChange={e=>set('bio',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.primarySkill')}</label>
                    <select className="select" value={form.primarySkill} onChange={e=>set('primarySkill',e.target.value)}>
                      <option value="">{t('categories.all')}</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.skills')}</label>
                    <input className="input" placeholder="Wiring, Installation, Troubleshooting..." value={form.skills} onChange={e=>set('skills',e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(0)} className="btn btn-secondary flex-1"><ChevronLeft size={16} /> {t('btn.back')}</button>
                  <button onClick={() => setStep(2)} disabled={!form.profTitle} className="btn btn-primary flex-1">{t('btn.next')} <ChevronRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <div className="card animate-fade-in">
                <h2 className="font-semibold text-gray-900 mb-5">{t('registerWorker.step3')}</h2>
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label">{t('registerWorker.hourlyRate')} *</label>
                    <input className="input" type="number" placeholder="₹300" value={form.hourlyRate} onChange={e=>set('hourlyRate',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.travelDistance')}</label>
                    <select className="select" value={form.travelDist} onChange={e=>set('travelDist',e.target.value)}>
                      {DIST_OPTIONS.map(d => <option key={d} value={d}>{t(`registerWorker.${d}`)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label mb-3">{t('registerWorker.workPrefs')}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {WORK_PREFS.map(p => (
                        <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" className="accent-[#1A56DB]" checked={prefs.includes(p)} onChange={() => togglePref(p)} />
                          {t(`findWork.${p}`)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.availability')}</label>
                    <div className="flex gap-3 flex-wrap">
                      {AVAIL_OPTIONS.map(a => (
                        <button key={a} onClick={() => set('availability', a)}
                          className={`py-2 px-4 rounded-lg border text-sm transition-all ${form.availability===a ? 'border-[#1A56DB] bg-blue-50 text-[#1A56DB]' : 'border-gray-200 text-gray-500'}`}>
                          {t(`registerWorker.${a}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(1)} className="btn btn-secondary flex-1"><ChevronLeft size={16} /> {t('btn.back')}</button>
                  <button onClick={() => setStep(3)} className="btn btn-primary flex-1">{t('btn.next')} <ChevronRight size={16} /></button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <div className="card animate-fade-in">
                <h2 className="font-semibold text-gray-900 mb-5">{t('registerWorker.step4')}</h2>
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label">{t('registerWorker.password')} *</label>
                    <input className="input" type="password" value={form.password} onChange={e=>set('password',e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('registerWorker.confirmPassword')} *</label>
                    <input className="input" type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)} />
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="error-text mt-1">{t('errors.passwordMatch')}</p>
                    )}
                  </div>
                  {/* Premium offer */}
                  <div className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${form.premium ? 'border-amber-400 bg-amber-50' : 'border-gray-200'}`}
                    onClick={() => set('premium', !form.premium)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{t('registerWorker.premiumOffer')}</span>
                      <div className="toggle-switch" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={form.premium} onChange={e => set('premium', e.target.checked)} />
                        <span className="toggle-slider" />
                      </div>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {premiumBenefits.map(b => <li key={b} className="flex items-center gap-1"><CheckCircle size={11} className="text-amber-500" /> {b}</li>)}
                    </ul>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 accent-[#1A56DB]" checked={form.terms} onChange={e => set('terms', e.target.checked)} />
                    <span className="text-sm text-gray-600">{t('registerWorker.terms')}</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(2)} className="btn btn-secondary flex-1"><ChevronLeft size={16} /> {t('btn.back')}</button>
                  <button onClick={() => setSubmitted(true)}
                    disabled={!form.password || form.password !== form.confirmPassword || !form.terms}
                    className="btn btn-primary flex-1">{t('registerWorker.submit')}</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="card mb-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">{t('registerWorker.benefits')}</h3>
              <ul className="space-y-3">
                {benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="badge badge-premium mb-3">Premium Benefits</div>
                <ul className="space-y-3">
                  {premiumBenefits.map(b => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterWorker;
