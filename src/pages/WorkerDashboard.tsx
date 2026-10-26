import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, User, Briefcase, Bookmark, MessageSquare, 
  Award, Settings, LogOut, Menu, X, ChevronRight, Star,
  CheckCircle, Eye, Calendar, Clock, Loader2, Save, Navigation, MapPin
} from 'lucide-react';
import { fetchWorkerByUserId, fetchWorkerApplications, fetchCertifications, updateWorkerProfile, fetchJobs, applyForJob } from '../lib/api';
import type { WorkerProfile, JobApplication, Certification, JobListing } from '../types';
import { Link } from 'react-router-dom';

const WorkerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real data state
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<JobListing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Quick Apply state
  const [applyingJob, setApplyingJob] = useState<JobListing | null>(null);
  const [coverMessage, setCoverMessage] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState('');

  // Profile form state
  const [form, setForm] = useState({ first_name: '', last_name: '', title: '', bio: '', city: '', state: '', hourly_rate: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      setDataLoading(true);
      const { data: w } = await fetchWorkerByUserId(user.id);
      if (w) {
        setWorker(w);
        setForm({ first_name: w.first_name, last_name: w.last_name, title: w.title, bio: w.bio, city: w.city, state: w.state, hourly_rate: w.hourly_rate });
        const { data: apps } = await fetchWorkerApplications(w.id);
        const { data: certs } = await fetchCertifications(w.id);
        const { data: nearby } = await fetchJobs({
          location: w.city || w.location || 'Mumbai',
          sortBy: 'closest',
        });
        setApplications(apps || []);
        setCertifications(certs || []);
        setNearbyJobs((nearby || []).slice(0, 3));
      }
      setDataLoading(false);
    })();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await updateWorkerProfile(user.id, form);
    setSaving(false);
  };

  const handleApplyToJob = async () => {
    if (!applyingJob) return;
    setSubmittingApp(true);
    const workerId = worker?.id || 'demo-wp-1';
    const { data: newApp, error } = await applyForJob(applyingJob.id, workerId, coverMessage);
    setSubmittingApp(false);
    if (!error && newApp) {
      setApplications(prev => [newApp, ...prev.filter(a => a.job_id !== applyingJob.id)]);
      setApplySuccessMessage(`Successfully applied for "${applyingJob.title}"!`);
      setApplyingJob(null);
      setCoverMessage('');
      setTimeout(() => setApplySuccessMessage(''), 4000);
    }
  };


  const TABS = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'profile', icon: User, label: t('dashboard.myProfile') },
    { id: 'applications', icon: Briefcase, label: t('dashboard.applications') },
    { id: 'saved', icon: Bookmark, label: t('dashboard.savedJobs') },
    { id: 'messages', icon: MessageSquare, label: t('dashboard.messages') },
    { id: 'certifications', icon: Award, label: t('dashboard.certifications') },
    { id: 'settings', icon: Settings, label: t('dashboard.settings') },
  ];

  const handleSignOut = () => {
    signOut();
    window.location.href = '/';
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 md:hidden flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-gray-900">{t('nav.dashboard')}</span>
        <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
      </div>
      <div className="hidden md:flex items-center gap-3 p-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
          {user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">{user?.email || 'Worker'}</div>
          <div className="text-xs text-gray-400">Worker Account</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-50 text-[var(--primary)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
            style={activeTab === tab.id ? { borderRight: '3px solid var(--primary)' } : {}}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={18} />
          {t('nav.signOut')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="font-bold text-gray-900">{TABS.find(t => t.id === activeTab)?.label}</div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-xl">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl"><Sidebar /></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 min-h-[calc(100vh-64px)] sticky top-16">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">

        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Welcome back, {worker?.first_name || user?.email?.split('@')[0]}! 👋
            </h1>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
              {[
                { label: t('dashboard.profileViews'), value: worker?.profile_views ?? 0, icon: Eye, color: '#4F46E5' },
                { label: t('dashboard.applicationsSent'), value: applications.length, icon: Briefcase, color: '#10B981' },
                { label: t('dashboard.interviews'), value: applications.filter(a => a.status === 'shortlisted').length, icon: Calendar, color: '#F59E0B' },
                { label: t('dashboard.jobsCompleted'), value: applications.filter(a => a.status === 'hired').length, icon: CheckCircle, color: '#8B5CF6' },
              ].map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.color + '15' }}>
                      <stat.icon size={20} color={stat.color} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="card mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{t('dashboard.profileCompletion')}</h3>
                <span className="text-sm font-bold text-[var(--primary)]">
                  {worker ? Math.min(100, [worker.first_name, worker.title, worker.bio, worker.city, (worker.skills?.length || 0) > 0].filter(Boolean).length * 20) : 0}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${worker ? Math.min(100, [worker.first_name, worker.title, worker.bio, worker.city, (worker.skills?.length || 0) > 0].filter(Boolean).length * 20) : 0}%`,
                  background: 'var(--gradient-primary)'
                }} />
              </div>
              <p className="text-sm text-gray-500">{t('dashboard.completeProfile')}</p>
              <button onClick={() => setActiveTab('profile')} className="text-sm text-[var(--primary)] font-semibold mt-2 flex items-center gap-1 hover:underline">
                Complete Now <ChevronRight size={14} />
              </button>
            </div>

            {/* Apply success toast notification */}
            {applySuccessMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
                <span>✅ {applySuccessMessage}</span>
                <button onClick={() => setApplySuccessMessage('')} className="text-emerald-600 hover:text-emerald-800">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Location-based Jobs Near You */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Navigation size={18} className="text-[var(--primary)] fill-[var(--primary)]" />
                    Jobs Near You
                  </h2>
                  <p className="text-xs text-gray-500">
                    Showing jobs within your travel radius ({worker?.travel_distance || '25 km'}) near {worker?.city || 'your area'}
                  </p>
                </div>
                <Link
                  to={`/find-work?location=${encodeURIComponent(worker?.city || 'Mumbai')}&sortBy=closest`}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  View All <ChevronRight size={13} />
                </Link>
              </div>

              {nearbyJobs.length === 0 ? (
                <div className="card text-center py-8">
                  <p className="text-gray-400 text-sm">No nearby listings found right now.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                  {nearbyJobs.map(job => {
                    const isApplied = applications.some(a => a.job_id === job.id);
                    return (
                      <div key={job.id} className="card glow-card p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="badge badge-new text-xs">{job.category}</span>
                            {job.distance !== undefined && (
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <Navigation size={9} className="text-emerald-600 fill-emerald-600" />
                                {job.distance < 1 ? '< 1 km' : `${job.distance} km away`}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">{job.title}</h4>
                          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                            <MapPin size={11} className="text-gray-400" /> {job.location}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-bold gradient-text">₹{job.pay_rate}</span>
                          {isApplied ? (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              ✓ Applied
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setApplyingJob(job); setCoverMessage(''); }}
                              className="btn btn-primary btn-sm text-xs py-1 px-3"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <h2 className="font-bold text-gray-900 mb-4">Recent Applications</h2>
            {applications.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-gray-400">No applications yet. <Link to="/find-work" className="text-[var(--primary)] font-semibold">Browse Jobs →</Link></p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 stagger-children">
                {applications.slice(0, 3).map(app => (
                  <div key={app.id} className="card flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-light)' }}>
                      <Briefcase size={20} className="text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{(app.job as any)?.title || 'Application'}</h3>
                      <p className="text-sm text-gray-500">
                        {((app.job as any)?.employer?.name || (app.job as any)?.employer?.company_name) ? `${(app.job as any)?.employer?.name || (app.job as any)?.employer?.company_name} · ` : ''}
                        {(app.job as any)?.location || 'Local'}
                      </p>
                    </div>
                    <span className={`badge ${app.status === 'hired' ? 'badge-verified' : app.status === 'shortlisted' ? 'bg-purple-50 text-purple-600' : app.status === 'rejected' ? 'badge-rejected' : 'bg-blue-50 text-blue-600'}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.myProfile')}</h1>
            <div className="card mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: 'var(--gradient-primary)' }}>
                  {(form.first_name[0] || '?')}{(form.last_name[0] || '')}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{form.first_name} {form.last_name}</h2>
                  <p className="text-gray-500">{form.title}</p>
                  {worker && (
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{worker.rating}</span>
                      <span className="text-sm text-gray-400">({worker.total_reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input className="input" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input className="input" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Professional Title</label>
                  <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Hourly Rate (₹)</label>
                  <input className="input" type="number" value={form.hourly_rate} onChange={e => setForm(f => ({ ...f, hourly_rate: +e.target.value }))} />
                </div>
                <div className="form-group sm:col-span-2">
                  <label className="label">Bio</label>
                  <textarea className="textarea" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} />
                </div>
                <div className="form-group">
                  <label className="label">City</label>
                  <input className="input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">State</label>
                  <input className="input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
                </div>
              </div>
              {worker?.skills && worker.skills.length > 0 && (
                <div className="mt-5">
                  <label className="label mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map(s => <span key={s} className="pill">{s}</span>)}
                  </div>
                </div>
              )}
              <button className="btn btn-primary mt-6 flex items-center gap-2" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.applications')}</h1>
            {applications.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="font-bold text-gray-900 mb-1">No applications yet</h3>
                <p className="text-gray-500 text-sm mb-4">Start applying for jobs that match your skills.</p>
                <Link to="/find-work" className="btn btn-primary">Browse Jobs</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 stagger-children">
                {applications.map(app => (
                  <div key={app.id} className="card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--primary-light)' }}>
                      <Briefcase size={22} className="text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{(app.job as any)?.title || 'Application'}</h3>
                      <p className="text-sm text-gray-500">
                        {((app.job as any)?.employer?.name || (app.job as any)?.employer?.company_name) ? `${(app.job as any)?.employer?.name || (app.job as any)?.employer?.company_name} · ` : ''}
                        {(app.job as any)?.location || 'Local'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${app.status === 'hired' ? 'badge-verified' : app.status === 'shortlisted' ? 'bg-purple-50 text-purple-600' : app.status === 'rejected' ? 'badge-rejected' : 'bg-blue-50 text-blue-600'}`}>
                        {app.status}
                      </span>
                      <span className="text-sm font-bold gradient-text">₹{(app.job as any)?.pay_rate || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === 'certifications' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.certifications')}</h1>
            <div className="flex flex-col gap-4 stagger-children">
              {certifications.length === 0 ? (
                <div className="card text-center py-10">
                  <p className="text-gray-400">No certifications yet.</p>
                </div>
              ) : certifications.map((cert) => (
                <div key={cert.id} className="card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
                    <Award size={22} className="text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cert.cert_name}</h3>
                    <p className="text-sm text-gray-500">{cert.partner_name || cert.type}</p>
                  </div>
                  <span className={`badge ${cert.status === 'approved' ? 'badge-verified' : cert.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`}>
                    {cert.status === 'approved' && <CheckCircle size={10}/>}
                    {cert.status === 'pending' && <Clock size={10}/>}
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/certifications" className="btn btn-primary mt-6">Get New Certification</Link>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.messages')}</h1>
            <div className="card text-center py-10">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Messaging will be available once you connect your Supabase account.</p>
            </div>
          </div>
        )}

        {/* SAVED JOBS TAB */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.savedJobs')}</h1>
            <div className="card text-center py-10">
              <Bookmark size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Saved jobs will appear here. <Link to="/find-work" className="text-[var(--primary)] font-semibold">Browse Jobs →</Link></p>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.settings')}</h1>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" defaultValue={user?.email || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" type="tel" placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label className="label">Language</label>
                  <select className="select">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="mr">Marathi</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="flex flex-col gap-4">
                {['New job matches', 'Application updates', 'Messages', 'Certification status'].map(item => (
                  <label key={item} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{item}</span>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary">Save Settings</button>
          </div>
        )}
          </>
        )}
      </div>

      {/* Quick Apply Modal rendered into document.body */}
      {applyingJob && typeof document !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 100000 }}
            onClick={() => setApplyingJob(null)}
          />
          <div
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              zIndex: 100001,
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              animation: 'fadeInUp 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>Apply for Job</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{applyingJob.title}</p>
              </div>
              <button onClick={() => setApplyingJob(null)} style={{ padding: '4px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} color="#94A3B8" />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span className="badge badge-new text-xs">{applyingJob.category}</span>
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                ₹{applyingJob.pay_rate} {applyingJob.pay_type}
              </span>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
                📍 {applyingJob.location}
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="label">Cover Message (optional)</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Tell the employer when you're available and why you're a great fit..."
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setApplyingJob(null)}
                disabled={submittingApp}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleApplyToJob}
                disabled={submittingApp}
              >
                {submittingApp ? 'Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default WorkerDashboard;
