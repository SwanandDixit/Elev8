import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, Briefcase, Users, Bookmark, MessageSquare,
  Settings, LogOut, Menu, X, PlusCircle, MapPin, Star,
  CheckCircle, Clock, ChevronRight, Bell, Camera,
  TrendingUp, Shield, Zap, Edit3, Trash2, Eye,
  ArrowUpRight, IndianRupee, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_JOBS, MOCK_WORKERS } from '../lib/mockData';
import NegotiationPanel from '../components/negotiation/NegotiationPanel';

/* ────────────────────────────────────────────────────────── */
/* Constants                                                  */
/* ────────────────────────────────────────────────────────── */

const MOCK_APPLICATIONS = MOCK_WORKERS.slice(0, 5).map((w, i) => ({
  id: `app-${i + 1}`,
  worker: w,
  job: MOCK_JOBS[i % MOCK_JOBS.length],
  status: ['applied', 'shortlisted', 'viewed', 'hired', 'applied'][i] as string,
  applied_at: new Date(Date.now() - i * 86400000).toISOString(),
  message: [
    'I have 8 years of experience in this field and can start immediately.',
    'Available all week. Can provide references from previous clients.',
    'My rate is negotiable. I carry all my own tools and equipment.',
    'Have done similar work at 3 hotels in the city. Portfolio available.',
    'Looking forward to working on this project. Please review my profile.',
  ][i],
  proposed_rate: [350, 280, 320, 250, 300][i],
}));

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  applied:     { label: 'New',         color: '#4F46E5', bg: '#EEF2FF' },
  viewed:      { label: 'Viewed',      color: '#6B7280', bg: '#F9FAFB' },
  shortlisted: { label: 'Shortlisted', color: '#F59E0B', bg: '#FFFBEB' },
  hired:       { label: 'Hired',       color: '#10B981', bg: '#ECFDF5' },
  rejected:    { label: 'Rejected',    color: '#EF4444', bg: '#FEF2F2' },
};

/* ────────────────────────────────────────────────────────── */
/* Main Component                                             */
/* ────────────────────────────────────────────────────────── */

const EmployerDashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<typeof MOCK_APPLICATIONS[0] | null>(null);
  const [notifications] = useState(3);
  const photoRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || 'Customer',
    company: '',
    location: 'Mumbai, Maharashtra',
    phone: '',
    description: '',
    photoUrl: '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSignOut = () => { signOut(); window.location.href = '/'; };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile(p => ({ ...p, photoUrl: url }));
  };

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const TABS = [
    { id: 'overview',      icon: LayoutDashboard, label: 'Overview',      badge: 0 },
    { id: 'listings',      icon: Briefcase,        label: 'My Jobs',       badge: 0 },
    { id: 'applications',  icon: Users,            label: 'Applications',  badge: 3 },
    { id: 'negotiate',     icon: TrendingUp,       label: 'Negotiations',  badge: 1 },
    { id: 'saved',         icon: Bookmark,         label: 'Saved Workers', badge: 0 },
    { id: 'messages',      icon: MessageSquare,    label: 'Messages',      badge: 2 },
    { id: 'profile',       icon: Settings,         label: 'My Profile',    badge: 0 },
  ];

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Mobile close */}
      <div className="p-4 md:hidden flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-gray-900">Menu</span>
        <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
      </div>

      {/* User profile header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt="Profile" className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
              {(profile.name?.[0] || 'C').toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 truncate">{profile.name}</div>
            <div className="text-xs text-amber-600 font-medium">Customer Account</div>
          </div>
        </div>
        <Link
          to="/post-requirements"
          className="btn btn-primary w-full mt-3 flex items-center justify-center gap-2 text-sm"
        >
          <PlusCircle size={15} /> Post a Job
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-indigo-700 bg-indigo-50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {activeTab === tab.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600 rounded-r" />
            )}
            <tab.icon size={17} />
            <span className="flex-1 text-left">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                style={{ background: '#EF4444' }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen flex flex-col md:flex-row pb-20 md:pb-0" style={{ background: 'var(--bg)' }}>

      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 bg-gray-100 rounded-xl">
          <Menu size={20} />
        </button>
        <span className="font-bold text-gray-900">{TABS.find(t => t.id === activeTab)?.label}</span>
        <button className="relative p-2 bg-gray-100 rounded-xl">
          <Bell size={18} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {notifications}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 min-h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl animate-fade-in">
            {/* Welcome header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {profile.name.split(' ')[0]} 👋
                </h1>
                <p className="text-gray-500 mt-0.5">Here's what's happening with your job listings</p>
              </div>
              <Link to="/post-requirements" className="btn btn-primary hidden md:flex items-center gap-2">
                <PlusCircle size={16} /> Post a Job
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Listings', value: '4', icon: Briefcase, color: '#4F46E5', change: '+1 this week' },
                { label: 'Applications', value: '42', icon: Users, color: '#10B981', change: '+8 today' },
                { label: 'Workers Hired', value: '3', icon: CheckCircle, color: '#F59E0B', change: 'All time' },
                { label: 'Pending Negotiations', value: '2', icon: TrendingUp, color: '#8B5CF6', change: 'Needs action' },
              ].map((stat) => (
                <div key={stat.label} className="card p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: stat.color + '15' }}>
                      <stat.icon size={20} color={stat.color} />
                    </div>
                    <ArrowUpRight size={14} className="text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                  <div className="text-xs text-green-600 mt-1">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setActiveTab('applications')}
                className="card text-left hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Users size={18} className="text-indigo-600" />
                  </span>
                  <span className="w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                </div>
                <p className="font-semibold text-gray-900">Review Applications</p>
                <p className="text-xs text-gray-500 mt-0.5">3 new applications need review</p>
              </button>
              <button
                onClick={() => setActiveTab('negotiate')}
                className="card text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                    <TrendingUp size={18} className="text-purple-600" />
                  </span>
                  <span className="w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                </div>
                <p className="font-semibold text-gray-900">Price Negotiations</p>
                <p className="text-xs text-gray-500 mt-0.5">1 worker awaiting your response</p>
              </button>
              <Link to="/browse-workers" className="card hover:shadow-lg transition-shadow block">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                    <Search size={18} className="text-green-600" />
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
                <p className="font-semibold text-gray-900">Browse Workers</p>
                <p className="text-xs text-gray-500 mt-0.5">10,000+ verified workers available</p>
              </Link>
            </div>

            {/* Recent Applications */}
            <div className="card mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Recent Applicants</h2>
                <button onClick={() => setActiveTab('applications')}
                  className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {MOCK_APPLICATIONS.slice(0, 3).map(app => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      style={{ background: 'var(--gradient-primary)' }}>
                      {app.worker.first_name[0]}{app.worker.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900">{app.worker.first_name} {app.worker.last_name}</div>
                      <div className="text-xs text-gray-500 truncate">{app.worker.title} · {app.job?.title}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          color: STATUS_LABELS[app.status]?.color,
                          background: STATUS_LABELS[app.status]?.bg,
                        }}>
                        {STATUS_LABELS[app.status]?.label}
                      </span>
                      <button
                        onClick={() => { setSelectedApplication(app); setActiveTab('applications'); }}
                        className="btn btn-secondary btn-sm">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency notice if any urgent job */}
            <div className="card" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-900">Your listings are verified ✓</p>
                  <p className="text-sm text-indigo-700 mt-0.5">
                    Workers can see your verified status. Complete your profile to attract 3× more applications.
                  </p>
                  <button onClick={() => setActiveTab('profile')} className="text-sm text-indigo-600 font-semibold mt-2 hover:underline">
                    Complete Profile →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY JOB LISTINGS ──────────────────────────────── */}
        {activeTab === 'listings' && (
          <div className="max-w-4xl animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Job Listings</h1>
              <Link to="/post-requirements" className="btn btn-primary flex items-center gap-2">
                <PlusCircle size={16} /> Post New Job
              </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {['All', 'Active', 'Expired', 'Closed'].map(f => (
                <button key={f}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    f === 'All' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {MOCK_JOBS.slice(0, 5).map((job, i) => (
                <div key={job.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: '#EEF2FF' }}>
                      {['⚡','🔧','🪚','👨‍🍳','🧹'][i % 5]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin size={12} /> {job.location}
                            <span className="text-gray-300">·</span>
                            <Clock size={12} /> Posted 2d ago
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            job.status === 'active' ? 'text-green-700 bg-green-100' : 'text-gray-500 bg-gray-100'
                          }`}>
                            {job.status}
                          </span>
                          {job.urgency === 'very_urgent' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full text-red-700 bg-red-100 flex items-center gap-1">
                              <Zap size={10} /> Emergency
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                          <IndianRupee size={14} />
                          {job.pay_rate.toLocaleString()}
                          <span className="text-xs font-normal text-gray-500">/{job.pay_type}</span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users size={12} /> {Math.floor(Math.random() * 8) + 1} applicants
                        </span>
                        {job.urgency !== 'normal' && (
                          <span className="text-xs text-amber-600 font-medium">
                            +{job.urgency === 'very_urgent' ? 40 : 20}% emergency
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="btn btn-primary btn-sm flex items-center gap-1.5">
                      <Eye size={13} /> View Applications
                    </button>
                    <button className="btn btn-secondary btn-sm flex items-center gap-1.5">
                      <Edit3 size={13} /> Edit
                    </button>
                    <button className="btn btn-sm flex items-center gap-1.5 text-red-500 hover:bg-red-50">
                      <Trash2 size={13} /> Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── APPLICATIONS RECEIVED ────────────────────────── */}
        {activeTab === 'applications' && (
          <div className="max-w-5xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Applications Received</h1>

            <div className="grid lg:grid-cols-5 gap-5">
              {/* Applications list */}
              <div className="lg:col-span-2 flex flex-col gap-3">
                {MOCK_APPLICATIONS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApplication(app)}
                    className={`card text-left transition-all hover:shadow-md ${
                      selectedApplication?.id === app.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                        style={{ background: 'var(--gradient-primary)' }}>
                        {app.worker.first_name[0]}{app.worker.last_name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900">{app.worker.first_name} {app.worker.last_name}</div>
                        <div className="text-xs text-gray-500 truncate">{app.worker.title}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-medium text-gray-700">{app.worker.rating}</span>
                          <span className="text-xs text-gray-400">({app.worker.total_reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full block mb-1"
                          style={{
                            color: STATUS_LABELS[app.status]?.color,
                            background: STATUS_LABELS[app.status]?.bg,
                          }}>
                          {STATUS_LABELS[app.status]?.label}
                        </span>
                        <div className="text-xs font-bold text-gray-900">₹{app.proposed_rate}</div>
                        <div className="text-xs text-gray-400">{app.job?.pay_type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Application detail panel */}
              <div className="lg:col-span-3">
                {selectedApplication ? (
                  <div className="flex flex-col gap-4">
                    {/* Worker card */}
                    <div className="card">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                          style={{ background: 'var(--gradient-primary)' }}>
                          {selectedApplication.worker.first_name[0]}{selectedApplication.worker.last_name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-lg">
                              {selectedApplication.worker.first_name} {selectedApplication.worker.last_name}
                            </h2>
                            {selectedApplication.worker.is_premium && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Premium</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{selectedApplication.worker.title}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1">
                              <Star size={13} className="text-amber-400 fill-amber-400" />
                              <span className="text-sm font-semibold">{selectedApplication.worker.rating}</span>
                              <span className="text-xs text-gray-400">({selectedApplication.worker.total_reviews} reviews)</span>
                            </div>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500 flex items-center gap-0.5">
                              <MapPin size={11} /> {selectedApplication.worker.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Application message */}
                      {selectedApplication.message && (
                        <div className="rounded-xl p-3 mb-4" style={{ background: '#F8FAFC' }}>
                          <p className="text-xs font-medium text-gray-500 mb-1">Worker's message:</p>
                          <p className="text-sm text-gray-700">{selectedApplication.message}</p>
                        </div>
                      )}

                      {/* Skills */}
                      {selectedApplication.worker.skills && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-500 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApplication.worker.skills.map(skill => (
                              <span key={skill} className="pill text-xs">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button className="btn btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm">
                          <CheckCircle size={14} /> Shortlist
                        </button>
                        <button className="btn btn-secondary flex items-center gap-1.5 text-sm">
                          <MessageSquare size={14} /> Message
                        </button>
                        <Link to={`/worker/${selectedApplication.worker.id}`}
                          className="btn btn-ghost flex items-center gap-1.5 text-sm">
                          <Eye size={14} /> Profile
                        </Link>
                      </div>
                    </div>

                    {/* Price Negotiation Panel */}
                    <NegotiationPanel
                      viewerRole="employer"
                      jobCategory={selectedApplication.job?.category || 'electrician'}
                      jobUrgency={selectedApplication.job?.urgency || 'normal'}
                      listedRate={selectedApplication.job?.pay_rate || 0}
                      payType={selectedApplication.job?.pay_type || 'daily'}
                    />
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <Users size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="font-medium text-gray-500">Select an application to review</p>
                    <p className="text-sm text-gray-400 mt-1">Click on any applicant to see their details and negotiate price</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── NEGOTIATIONS ─────────────────────────────────── */}
        {activeTab === 'negotiate' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Price Negotiations</h1>
            <p className="text-gray-500 mb-6">Manage rate negotiations with workers who applied to your jobs.</p>

            {/* How it works */}
            <div className="card mb-6" style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', border: '1px solid #C7D2FE' }}>
              <h3 className="font-bold text-indigo-900 mb-3">How Price Negotiation Works</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: '1', icon: '📝', title: 'Worker Proposes', desc: 'Worker applies with their rate or counter-proposes to your listed rate' },
                  { step: '2', icon: '💬', title: 'You Respond', desc: 'Accept, decline, or make a counter-offer. System suggests fair market rates' },
                  { step: '3', icon: '🤝', title: 'Agreement Reached', desc: 'Once agreed, the final rate is locked in and the job moves forward' },
                ].map(item => (
                  <div key={item.step} className="flex gap-3">
                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-sm text-indigo-900">{item.title}</p>
                      <p className="text-xs text-indigo-700 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample negotiation */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    R
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ramesh Kumar</p>
                    <p className="text-xs text-gray-500">Electrician · Applied to: Office Rewiring</p>
                  </div>
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Awaiting You</span>
                </div>
                <NegotiationPanel
                  viewerRole="employer"
                  jobCategory="electrician"
                  jobUrgency="urgent"
                  listedRate={500}
                  payType="daily"
                  negotiation={{
                    id: 'neg-1',
                    application_id: 'app-1',
                    job_id: 'job-1',
                    worker_id: 'w-1',
                    employer_id: 'e-1',
                    status: 'pending_customer',
                    original_rate: 500,
                    worker_proposed_rate: 650,
                    worker_message: "I have 8 years experience and can guarantee quality work. I also bring my own professional tools worth ₹50,000.",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    offers: [
                      { id: 'o1', negotiation_id: 'neg-1', offered_by: 'worker', offered_rate: 650, message: "I have 8 years experience...", created_at: new Date().toISOString() }
                    ],
                  }}
                />
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Suresh Patil</p>
                    <p className="text-xs text-gray-500">Plumber · Applied to: Bathroom Renovation</p>
                  </div>
                  <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Agreed ✓</span>
                </div>
                <NegotiationPanel
                  viewerRole="employer"
                  jobCategory="plumber"
                  jobUrgency="normal"
                  listedRate={400}
                  payType="daily"
                  negotiation={{
                    id: 'neg-2',
                    application_id: 'app-2',
                    job_id: 'job-2',
                    worker_id: 'w-2',
                    employer_id: 'e-1',
                    status: 'accepted',
                    original_rate: 400,
                    worker_proposed_rate: 500,
                    employer_counter_rate: 450,
                    final_agreed_rate: 450,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    offers: [
                      { id: 'o1', negotiation_id: 'neg-2', offered_by: 'worker', offered_rate: 500, created_at: new Date().toISOString() },
                      { id: 'o2', negotiation_id: 'neg-2', offered_by: 'employer', offered_rate: 450, message: 'Fair split of the difference', created_at: new Date().toISOString() },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SAVED WORKERS ────────────────────────────────── */}
        {activeTab === 'saved' && (
          <div className="max-w-4xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Workers</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_WORKERS.slice(0, 6).map(w => (
                <div key={w.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: 'var(--gradient-primary)' }}>
                      {w.first_name[0]}{w.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{w.first_name} {w.last_name}</div>
                      <div className="text-xs text-gray-500 truncate">{w.title}</div>
                    </div>
                    {w.availability_status === 'available' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0" title="Available" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold">{w.rating}</span>
                      <span className="text-xs text-gray-400">({w.total_reviews})</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900">₹{w.hourly_rate}<span className="text-xs font-normal text-gray-400">/hr</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {w.skills?.slice(0, 2).map(s => <span key={s} className="pill text-xs">{s}</span>)}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/worker/${w.id}`} className="btn btn-secondary btn-sm flex-1 text-center">View</Link>
                    <button className="btn btn-primary btn-sm flex-1">Contact</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MESSAGES ─────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Ramesh Kumar', role: 'Electrician', msg: 'I can start the rewiring project from tomorrow morning. Will bring all required tools.', time: '1h ago', unread: true, rate: '₹650/day' },
                { name: 'Suresh Patil', role: 'Plumber', msg: 'Thank you for accepting my rate. I can confirm the date next Monday.', time: '3h ago', unread: true, rate: '₹450/day' },
                { name: 'Anita Devi', role: 'Cleaning', msg: 'I have completed the deep cleaning. Please confirm when you can review.', time: '2d ago', unread: false, rate: '₹200/hr' },
                { name: 'Vijay Singh', role: 'Driver', msg: 'My schedule is open next week. Let me know the timings.', time: '3d ago', unread: false, rate: '₹22k/mo' },
              ].map((conv, i) => (
                <div key={i} className={`card flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${
                  conv.unread ? 'border-indigo-200' : ''
                }`} style={conv.unread ? { borderColor: '#C7D2FE' } : {}}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                    style={{ background: conv.unread ? 'var(--gradient-primary)' : '#CBD5E1' }}>
                    {conv.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-semibold text-sm ${conv.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {conv.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">{conv.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{conv.time}</span>
                        {conv.unread && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{conv.msg}</p>
                    <span className="text-xs text-indigo-600 font-medium">{conv.rate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MY PROFILE ───────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            {profileSaved && (
              <div className="rounded-xl px-4 py-3 mb-4 flex items-center gap-2"
                style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                <CheckCircle size={16} className="text-green-600" />
                <p className="text-sm font-medium text-green-700">Profile saved successfully!</p>
              </div>
            )}

            {/* Profile Photo */}
            <div className="card mb-5">
              <h3 className="font-bold text-gray-900 mb-4">Profile Photo</h3>
              <div className="flex items-center gap-5">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt="Profile"
                    className="w-20 h-20 rounded-2xl object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                    {profile.name?.[0]?.toUpperCase() || 'C'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{profile.name || 'Your Name'}</p>
                  <p className="text-sm text-gray-500 mb-3">Customer Account · {user?.email}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => photoRef.current?.click()}
                      className="btn btn-secondary btn-sm flex items-center gap-1.5">
                      <Camera size={14} /> Upload Photo
                    </button>
                    <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    {profile.photoUrl && (
                      <button
                        onClick={() => setProfile(p => ({ ...p, photoUrl: '' }))}
                        className="btn btn-sm text-red-500 hover:bg-red-50">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile info form */}
            <div className="card mb-5">
              <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="label">Full Name *</label>
                  <input className="input" value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Company / Organization (optional)</label>
                  <input className="input" placeholder="e.g. ABC Pvt Ltd or leave blank"
                    value={profile.company}
                    onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" value={user?.email || ''} disabled
                    style={{ background: '#F8FAFC', color: '#94A3B8' }} />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" type="tel" placeholder="+91 98765 43210"
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">Location</label>
                  <input className="input" placeholder="City, State"
                    value={profile.location}
                    onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="label">About You (shown to workers)</label>
                  <p className="text-xs text-gray-400 mb-1.5">
                    Workers trust customers who provide context. Describe yourself, your household, or business.
                  </p>
                  <textarea className="textarea" rows={3}
                    placeholder="e.g. I live in a 3BHK apartment in Andheri West. I run a small catering business and need reliable workers..."
                    value={profile.description}
                    onChange={e => setProfile(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card mb-5">
              <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'New applications on my jobs', checked: true },
                  { label: 'Worker messages', checked: true },
                  { label: 'Price negotiation updates', checked: true },
                  { label: 'Listing expiry reminders', checked: false },
                  { label: 'Platform tips & updates', checked: false },
                ].map(item => (
                  <label key={item.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <div className="toggle-switch">
                      <input type="checkbox" defaultChecked={item.checked} />
                      <span className="toggle-slider" />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleProfileSave} className="btn btn-primary">Save Profile</button>
              <button className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
