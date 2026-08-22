import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Bookmark, BookmarkCheck, Share2, Zap, Shield } from 'lucide-react';
import type { JobListing } from '../../types';

interface JobCardProps {
  job: JobListing;
  onApply?: (jobId: string) => void;
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

const JobCard: React.FC<JobCardProps> = ({ job, onApply }) => {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    onApply?.(job.id);
  };

  const categoryKey = `categories.${job.category}`;

  return (
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
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {timeAgo(job.created_at)}
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
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
  );
};

export default JobCard;
