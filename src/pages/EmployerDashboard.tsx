import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, Briefcase, Users, Bookmark, MessageSquare, 
  Settings, LogOut, Menu, X, PlusCircle, MapPin, Star,
  CheckCircle, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_JOBS, MOCK_WORKERS } from '../lib/mockData';

const EmployerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const TABS = [
    { id: 'overview', icon: LayoutDashboard, label: t('dashboard.overview') },
    { id: 'listings', icon: Briefcase, label: t('dashboard.myListings') },
    { id: 'applications', icon: Users, label: t('dashboard.applicationsReceived') },
    { id: 'saved', icon: Bookmark, label: t('dashboard.savedWorkers') },
    { id: 'messages', icon: MessageSquare, label: t('dashboard.messages') },
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
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--gradient-accent)' }}>
          {user?.email?.[0]?.toUpperCase() || 'E'}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-gray-900 truncate">{user?.email || 'Employer'}</div>
          <div className="text-xs text-gray-400">Employer Account</div>
        </div>
      </div>
      <div className="p-4">
        <Link to="/post-requirements" className="btn btn-primary w-full flex items-center justify-center gap-2">
          <PlusCircle size={18} /> Post New Job
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-50 text-[var(--primary)] border-r-3 border-[var(--primary)]' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
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
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-16 z-30">
        <div className="font-bold text-gray-900">{TABS.find(t => t.id === activeTab)?.label}</div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-xl"><Menu size={20} /></button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl"><Sidebar /></div>
        </div>
      )}

      <div className="hidden md:block w-64 flex-shrink-0 min-h-[calc(100vh-64px)] sticky top-16">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Employer Dashboard</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
              {[
                { label: t('dashboard.activeListings'), value: '4', icon: Briefcase, color: '#4F46E5' },
                { label: t('dashboard.totalApplicants'), value: '42', icon: Users, color: '#10B981' },
                { label: t('dashboard.hiredWorkers'), value: '3', icon: CheckCircle, color: '#F59E0B' },
                { label: t('dashboard.expiringSoon'), value: '1', icon: Clock, color: '#EF4444' },
              ].map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.color + '15' }}>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Applicants</h2>
                <button onClick={() => setActiveTab('applications')} className="text-sm text-[var(--primary)] font-semibold hover:underline flex items-center gap-1">View All <ChevronRight size={14}/></button>
              </div>
              <div className="flex flex-col gap-3 stagger-children">
                {MOCK_WORKERS.slice(0, 3).map(w => (
                  <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: 'var(--gradient-primary)' }}>
                      {w.first_name[0]}{w.last_name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">{w.first_name} {w.last_name}</div>
                      <div className="text-xs text-gray-500">{w.title}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={12} className="text-amber-400 fill-amber-400"/>
                      <span className="font-semibold">{w.rating}</span>
                    </div>
                    <Link to={`/worker/${w.id}`} className="btn btn-secondary btn-sm">View</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LISTINGS */}
        {activeTab === 'listings' && (
          <div className="max-w-4xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.myListings')}</h1>
              <Link to="/post-requirements" className="btn btn-primary btn-sm"><PlusCircle size={16}/> Post New</Link>
            </div>
            <div className="flex flex-col gap-4 stagger-children">
              {MOCK_JOBS.slice(0, 4).map(job => (
                <div key={job.id} className="card flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <span className={`badge ${job.status === 'active' ? 'badge-verified' : 'badge-pending'}`}>{job.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={12}/>{job.location} · <Clock size={12}/>{job.duration || 'Ongoing'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold gradient-text">₹{job.pay_rate}</div>
                    <div className="text-xs text-gray-400">3 applicants</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPLICATIONS RECEIVED */}
        {activeTab === 'applications' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.applicationsReceived')}</h1>
            <div className="flex flex-col gap-4 stagger-children">
              {MOCK_WORKERS.map((w, i) => {
                const jobs = ['Electrician for Office Rewiring', 'Hotel Maintenance', 'Furniture Installation'];
                const statuses = ['New', 'Reviewed', 'Shortlisted'];
                const colors = ['badge-new', 'badge-pending', 'badge-verified'];
                return (
                  <div key={w.id} className="card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: 'var(--gradient-primary)' }}>
                      {w.first_name[0]}{w.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{w.first_name} {w.last_name}</h3>
                      <p className="text-sm text-gray-500">{w.title} · Applied to: {jobs[i % 3]}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${colors[i % 3]}`}>{statuses[i % 3]}</span>
                      <Link to={`/worker/${w.id}`} className="btn btn-secondary btn-sm">View Profile</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SAVED WORKERS */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.savedWorkers')}</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {MOCK_WORKERS.slice(0, 3).map(w => (
                <div key={w.id} className="card glow-card text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3" style={{ background: 'var(--gradient-primary)' }}>
                    {w.first_name[0]}{w.last_name[0]}
                  </div>
                  <h3 className="font-bold text-gray-900">{w.first_name} {w.last_name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{w.title}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star size={14} className="text-amber-400 fill-amber-400"/>
                    <span className="font-semibold text-sm">{w.rating}</span>
                    <span className="text-xs text-gray-400">({w.total_reviews})</span>
                  </div>
                  <Link to={`/worker/${w.id}`} className="btn btn-primary btn-sm w-full">Contact</Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.messages')}</h1>
            <div className="flex flex-col gap-3 stagger-children">
              {[
                { name: 'Ramesh Kumar', msg: 'I am available from next Monday for the office rewiring project.', time: '1 hour ago', unread: true },
                { name: 'Suresh Patil', msg: 'Thank you for considering me. What are the working hours?', time: '5 hours ago', unread: true },
                { name: 'Mohan Das', msg: 'I have completed the furniture installation. Please review.', time: '2 days ago', unread: false },
              ].map((conv, i) => (
                <div key={i} className={`card flex items-center gap-4 cursor-pointer ${conv.unread ? 'border-[var(--primary)]/30 bg-indigo-50/30' : ''}`}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0" style={{ background: conv.unread ? 'var(--gradient-primary)' : '#94A3B8' }}>
                    {conv.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold text-sm ${conv.unread ? 'text-gray-900' : 'text-gray-600'}`}>{conv.name}</h3>
                      <span className="text-xs text-gray-400">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.msg}</p>
                  </div>
                  {conv.unread && <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.settings')}</h1>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Company Profile</h3>
              <div className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="label">Company Name</label>
                  <input className="input" placeholder="Your Company" />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" defaultValue={user?.email || ''} />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" type="tel" placeholder="+91 9876543210" />
                </div>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input className="input" placeholder="City, State" />
                </div>
              </div>
            </div>
            <div className="card mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="flex flex-col gap-4">
                {['New applications', 'Worker messages', 'Listing expiry alerts', 'Platform updates'].map(item => (
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
      </div>
    </div>
  );
};

export default EmployerDashboard;
