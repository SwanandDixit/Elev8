import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, XCircle, Upload, ExternalLink, Award } from 'lucide-react';

const CATEGORIES = ['electrician','plumber','carpenter','cook','cleaning','driver','security','painter','welder','mason'];
const PARTNERS = ['Udemy','UpSkill India','NSDC','ITI'];

const MOCK_MY_CERTS = [
  { id:'c1', cert_name:'Electrical Safety Level 2', type:'partner', partner_name:'ITI', status:'approved', created_at:'2024-09-01' },
  { id:'c2', cert_name:'Advanced Wiring', type:'elev8', status:'pending', created_at:'2024-10-15' },
  { id:'c3', cert_name:'Solar Panel Installation', type:'partner', partner_name:'Udemy', status:'rejected', created_at:'2024-08-20' },
];

const MOCK_CERTIFIED_WORKERS = [
  { id:'w1', name:'Ramesh Kumar', title:'Electrician', location:'Mumbai', certs:['ITI Electrical'], rating:4.8 },
  { id:'w2', name:'Suresh Patil', title:'Plumber', location:'Pune', certs:['NSDC Plumbing'], rating:4.9 },
  { id:'w3', name:'Mohan Das', title:'Carpenter', location:'Chennai', certs:['Elev8 Verified'], rating:4.7 },
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { t } = useTranslation();
  const map: Record<string, string> = { approved:'badge-verified', pending:'badge-pending', rejected:'badge-rejected' };
  const iconMap: Record<string, React.ReactNode> = {
    approved: <CheckCircle size={10} />, pending: <Clock size={10} />, rejected: <XCircle size={10} />
  };
  return <span className={`badge ${map[status]}`}>{iconMap[status]} {t(`certifications.${status}`)}</span>;
};

const Certifications: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [partner, setPartner] = useState('');
  const [certName, setCertName] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [skill, setSkill] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [elev8Submitted, setElev8Submitted] = useState(false);

  const tabs = [t('certifications.tab1'), t('certifications.tab2'), t('certifications.tab3')];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('certifications.title')}</h1>
          <p className="text-gray-600">{t('certifications.subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container flex gap-0">
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === i ? 'border-[#1A56DB] text-[#1A56DB]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-6">
        {/* Tab 1 — Get Certified */}
        {activeTab === 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Partner Cert */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <ExternalLink size={20} className="text-[#1A56DB]" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{t('certifications.partnerTitle')}</h2>
                  <p className="text-xs text-gray-500">{t('certifications.partnerDesc')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {PARTNERS.map(p => (
                  <div key={p} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700">{p}</div>
                ))}
              </div>
              {submitted ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 text-sm">
                  <CheckCircle size={16} /> Certificate submitted for review!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label">{t('certifications.partner')}</label>
                    <select className="select" value={partner} onChange={e => setPartner(e.target.value)}>
                      <option value="">Select partner...</option>
                      {PARTNERS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">{t('certifications.certName')}</label>
                    <input className="input" value={certName} onChange={e => setCertName(e.target.value)} placeholder="e.g. Electrical Safety Level 2" />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('certifications.certUrl')}</label>
                    <input className="input" value={certUrl} onChange={e => setCertUrl(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">or</span>
                    <button className="btn btn-secondary btn-sm"><Upload size={14} /> {t('certifications.certFile')}</button>
                  </div>
                  <button onClick={() => setSubmitted(true)} disabled={!partner || !certName} className="btn btn-primary">
                    {t('certifications.submitCert')}
                  </button>
                </div>
              )}
            </div>

            {/* Elev8 Verification */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Award size={20} className="text-amber-500" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{t('certifications.elev8Title')}</h2>
                  <p className="text-xs text-gray-500">{t('certifications.elev8Desc')}</p>
                </div>
              </div>
              {/* Process steps */}
              <div className="flex flex-col gap-3 mb-5">
                {[t('certifications.elev8Step1'), t('certifications.elev8Step2'), t('certifications.elev8Step3'), t('certifications.elev8Step4')].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-[#1A56DB] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</div>
                    {s}
                  </div>
                ))}
              </div>
              {elev8Submitted ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 text-sm">
                  <CheckCircle size={16} /> Application submitted! We'll be in touch within 3 working days.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="form-group">
                    <label className="label">{t('certifications.primarySkill')}</label>
                    <select className="select" value={skill} onChange={e => setSkill(e.target.value)}>
                      <option value="">Select skill...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">{t('certifications.yearsExp')}</label>
                    <input className="input" type="number" min="0" max="50" value={yearsExp} onChange={e => setYearsExp(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">{t('certifications.expDesc')}</label>
                    <textarea className="textarea" rows={3} value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Describe your experience and expertise..." />
                  </div>
                  <button onClick={() => setElev8Submitted(true)} disabled={!skill || !yearsExp} className="btn btn-cta">
                    {t('certifications.applyVerification')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2 — My Certifications */}
        {activeTab === 1 && (
          <div className="max-w-2xl">
            {MOCK_MY_CERTS.length === 0 ? (
              <div className="card text-center py-12">
                <Award size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">{t('certifications.noCerts')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {MOCK_MY_CERTS.map(cert => (
                  <div key={cert.id} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{cert.cert_name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {cert.type === 'partner' ? `${t('certifications.partnerCert')} · ${cert.partner_name}` : t('certifications.elev8Cert')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Submitted {new Date(cert.created_at).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge status={cert.status} />
                    </div>
                    {cert.status === 'rejected' && (
                      <button className="btn btn-secondary btn-sm mt-3">{t('certifications.resubmit')}</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3 — Browse Certified Workers */}
        {activeTab === 2 && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CERTIFIED_WORKERS.map(w => (
                <div key={w.id} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#1A56DB] text-white flex items-center justify-center font-semibold">
                      {w.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{w.name}</div>
                      <div className="text-xs text-gray-500">{w.title} · {w.location}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {w.certs.map(c => (
                      <span key={c} className="badge badge-verified"><CheckCircle size={10}/> {c}</span>
                    ))}
                  </div>
                  <button className="btn btn-secondary btn-sm w-full">{t('btn.viewProfile')}</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certifications;
