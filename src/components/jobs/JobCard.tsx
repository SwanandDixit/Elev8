import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Bookmark, BookmarkCheck, Share2, Zap, Shield, Navigation, X } from 'lucide-react';
import type { JobListing } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { applyForJob } from '../../lib/api';

interface JobCardProps {
  job: JobListing;
  onApply?: (jobId: string) => void;
  onApplySuccess?: (jobId: string) => void;
}

const PAY_TYPE_KEY: Record<string, string> = {
  hourly: 'misc.perHour',
  daily: 'misc.perDay',
  monthly: 'misc.perMonth',
  fixed: 'misc.fixed',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const APPLIED_KEY = 'elev8_applied_jobs';

function getAppliedJobs(): string[] {
  try {
    const raw = localStorage.getItem(APPLIED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function markApplied(jobId: string) {
  const existing = getAppliedJobs();
  if (!existing.includes(jobId)) {
    localStorage.setItem(APPLIED_KEY, JSON.stringify([...existing, jobId]));
  }
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onApplySuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, role, workerProfileId } = useAuthStore();

  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverMessage, setCoverMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const appliedJobs = getAppliedJobs();
    if (appliedJobs.includes(job.id)) setApplied(true);
  }, [job.id]);

  const handleApplyClick = () => {
    if (!user) {
      navigate(`/sign-in?redirect=/find-work`);
      return;
    }
    if (role !== 'worker') {
      alert('Only workers can apply for jobs. Please sign in as a worker.');
      return;
    }
    setShowModal(true);
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    const wpId = workerProfileId || 'demo-wp-1';
    const { error } = await applyForJob(job.id, wpId, coverMessage);
    setSubmitting(false);
    if (!error) {
      markApplied(job.id);
      setApplied(true);
      setSuccess(true);
      setShowModal(false);
      onApply?.(job.id);
      onApplySuccess?.(job.id);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const categoryKey = `categories.${job.category}`;

  return (
    <>
      <div className="card glow-card hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {job.is_premium && (
                <span className="badge badge-premium"><Zap size={10} /> Premium</span>
              )}
              <span className="badge badge-new">{t(categoryKey)}</span>
              {job.urgency === 'urgent' && (
                <span className="badge" style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FECACA' }}>Urgent</span>
              )}
              {job.distance !== undefined && job.distance <= 8 && (
                <span className="badge" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                  📍 Nearby
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{job.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {job.employer?.company_name || job.employer?.name}
              {job.employer?.is_verified && (
                <Shield size={12} className="inline ml-1 text-green-500" />
              )}
            </p>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            title={t('btn.save')}
          >
            {saved ? <BookmarkCheck size={18} className="text-[var(--primary)]" /> : <Bookmark size={18} className="text-gray-400" />}
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <MapPin size={13} className="text-gray-400" /> {job.location}
          </span>
          {job.distance !== undefined && (
            <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs border border-emerald-200">
              <Navigation size={10} className="text-emerald-600 fill-emerald-600" />
              {job.distance < 1 ? '< 1 km away' : `${job.distance} km away`}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} /> {timeAgo(job.created_at)}
          </span>
        </div>

        {/* Pay */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold gradient-text">₹{job.pay_rate.toLocaleString()}</span>
          <span className="text-sm text-gray-500">{t(PAY_TYPE_KEY[job.pay_type] || 'misc.fixed')}</span>
          {job.duration && <span className="text-sm text-gray-400">· {job.duration}</span>}
        </div>

        {/* Description snippet */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>

        {/* Skills */}
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.required_skills.map((skill) => (
              <span key={skill} className="pill text-xs">{skill}</span>
            ))}
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-3 px-3 py-2 rounded-lg text-sm font-semibold text-green-700" style={{ background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            ✅ Application sent successfully!
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleApplyClick}
            disabled={applied}
            className={`btn flex-1 ${applied ? 'btn-ghost text-green-600 border border-green-200 bg-green-50' : 'btn-primary'}`}
          >
            {applied ? '✓ ' + t('findWork.applied') : t('findWork.apply')}
          </button>
          <button className="btn btn-ghost btn-sm px-3">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000 }}
            onClick={() => setShowModal(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              zIndex: 1001,
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>Apply for this Job</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{job.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ padding: '4px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} color="#94A3B8" />
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="label">Cover Message (optional)</label>
              <textarea
                className="textarea"
                rows={4}
                placeholder="Tell the employer why you're a good fit for this job..."
                value={coverMessage}
                onChange={e => setCoverMessage(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={handleSubmitApplication}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JobCard;
