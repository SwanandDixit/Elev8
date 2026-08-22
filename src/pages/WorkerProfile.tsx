import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, CheckCircle, Zap, Clock, MessageSquare, ChevronLeft } from 'lucide-react';
import { MOCK_WORKERS, MOCK_REVIEWS } from '../lib/mockData';

const WorkerProfile: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const worker = MOCK_WORKERS.find(w => w.id === id) || MOCK_WORKERS[0];
  const reviews = MOCK_REVIEWS.filter(r => r.worker_id === worker.id);
  const initials = `${worker.first_name[0]}${worker.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20 md:pb-0">
      <div className="container py-6">
        <Link to="/browse-workers" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--primary)] mb-5 transition-colors font-medium">
          <ChevronLeft size={16} /> {t('misc.back')}
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile card */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20 glow-card">
              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
                  {initials}
                </div>
                <h1 className="text-xl font-bold text-gray-900">{worker.first_name} {worker.last_name}</h1>
                <p className="text-gray-500 text-sm">{worker.title}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <MapPin size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{worker.location}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                {worker.certifications?.some(c => c.status === 'approved') && (
                  <span className="badge badge-verified"><CheckCircle size={10} /> {t('misc.verified')}</span>
                )}
                {worker.is_premium && (
                  <span className="badge badge-premium"><Zap size={10} /> {t('misc.premium')}</span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div>
                  <div className="text-lg font-bold gradient-text">₹{worker.hourly_rate}</div>
                  <div className="text-xs text-gray-500">{t('misc.perHour')}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-lg font-bold text-gray-900">{worker.rating.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-gray-500">{worker.total_reviews} {t('misc.reviews')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 capitalize">{worker.experience_level}</div>
                  <div className="text-xs text-gray-500">{t('workerProfile.experience')}</div>
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-5 p-3 bg-gray-50 rounded-xl">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  worker.availability_status === 'available' ? 'bg-green-500' :
                  worker.availability_status === 'soon' ? 'bg-amber-400' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-gray-700">
                  {worker.availability_status === 'available' ? t('browseWorkers.availableNow') :
                   worker.availability_status === 'soon' ? t('browseWorkers.availableSoon') : 'Not Available'}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2">
                <Link to="/post-requirements" className="btn btn-cta">{t('btn.hireWorker')}</Link>
                <button className="btn btn-secondary"><MessageSquare size={16} /> {t('btn.sendMessage')}</button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-3">{t('workerProfile.about')}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{worker.bio}</p>
            </div>

            {worker.skills && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-3">{t('workerProfile.skills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map(s => (
                    <span key={s} className="pill">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {worker.work_preferences && (
              <div className="card">
                <h2 className="font-bold text-gray-900 mb-3">{t('workerProfile.preferences')}</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={15} className="text-gray-400" />
                    <span>{worker.work_preferences.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={15} className="text-gray-400" />
                    <span>Up to {worker.travel_distance}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">{t('workerProfile.reviews')} ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-500">{t('workerProfile.noReviews')}</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map(r => (
                    <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                          {r.reviewer_name?.[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{r.reviewer_name}</div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
