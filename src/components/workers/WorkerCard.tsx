import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, Zap } from 'lucide-react';
import type { WorkerProfile } from '../../types';

interface WorkerCardProps {
  worker: WorkerProfile;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const { t } = useTranslation();
  const initials = `${worker.first_name[0]}${worker.last_name[0]}`.toUpperCase();

  return (
    <div className="card glow-card flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0" style={{ background: 'var(--gradient-primary)' }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900">{worker.first_name} {worker.last_name}</h3>
            {worker.is_premium && (
              <span className="badge badge-premium">
                <Zap size={10} /> {t('misc.premium')}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{worker.title}</p>
        </div>
      </div>

      {/* Rating & Location */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} className="text-gray-400" />
          <span className="truncate">{worker.city || worker.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="font-semibold text-gray-900">{worker.rating.toFixed(1)}</span>
          <span className="text-gray-400">({worker.total_reviews})</span>
        </div>
      </div>

      {/* Skills */}
      {worker.skills && worker.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="pill text-xs">{skill}</span>
          ))}
          {worker.skills.length > 3 && (
            <span className="pill text-xs">+{worker.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Rate + Availability */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold gradient-text">₹{worker.hourly_rate}</span>
          <span className="text-sm text-gray-400 ml-1">{t('misc.perHour')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${
            worker.availability_status === 'available' ? 'bg-green-500' :
            worker.availability_status === 'soon' ? 'bg-amber-400' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-gray-500">
            {worker.availability_status === 'available' ? t('browseWorkers.availableNow') :
             worker.availability_status === 'soon' ? t('browseWorkers.availableSoon') : 'Not Available'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Link to={`/worker/${worker.id}`} className="btn btn-secondary btn-sm flex-1">
          {t('btn.viewProfile')}
        </Link>
        <Link to={`/worker/${worker.id}`} className="btn btn-primary btn-sm flex-1">
          {t('btn.contact')}
        </Link>
      </div>
    </div>
  );
};

export default WorkerCard;
