import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, SlidersHorizontal, X, Loader2, LocateFixed, Navigation } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import { fetchJobs, applyForJob } from '../lib/api';
import { getCurrentPosition } from '../lib/geo';
import { useAuthStore } from '../store/authStore';
import type { JobListing } from '../types';


const CATEGORIES = ['electrician','plumber','carpenter','cook','cleaning','driver','security','painter','welder','mason','acTech','gardener'];
const JOB_TYPES = ['fullTime','partTime','contract','emergency','weekend','evening'];
const RADIUS_OPTIONS = [
  { label: 'Any Distance', val: undefined },
  { label: 'Within 5 km', val: 5 },
  { label: 'Within 10 km', val: 10 },
  { label: 'Within 25 km', val: 25 },
  { label: 'Within 50 km', val: 50 },
];

const FindWork: React.FC = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, role, workerProfileId } = useAuthStore();

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(params.get('location') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [payTypes, setPayTypes] = useState<string[]>([]);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  // GPS Coordinates state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [locating, setLocating] = useState(false);

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const handleDetectLocation = async () => {
    setLocating(true);
    try {
      const coords = await getCurrentPosition();
      setUserCoords(coords);
      setIsGpsActive(true);
      setLocation('Current Location (GPS)');
      setSortBy('closest');
    } catch {
      // If permission denied or on desktop without GPS, fallback to default Mumbai coordinates
      setUserCoords({ lat: 19.0760, lng: 72.8777 });
      setIsGpsActive(true);
      setLocation('Mumbai (Auto-detected)');
      setSortBy('closest');
    } finally {
      setLocating(false);
    }
  };

  const clearLocation = () => {
    setLocation('');
    setUserCoords(null);
    setIsGpsActive(false);
    setRadius(undefined);
    if (sortBy === 'closest') setSortBy('newest');
  };

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, count, error: err } = await fetchJobs({
      query,
      location: isGpsActive ? '' : location,
      userLat: userCoords?.lat,
      userLng: userCoords?.lng,
      radius,
      category,
      sortBy: sortBy as 'newest' | 'highest_pay' | 'closest',
      verifiedOnly,
      payType: payTypes as never[],
    });
    if (err) setError('Failed to load jobs. Please try again.');
    else { setJobs(data || []); setTotal(count || 0); }
    setLoading(false);
  }, [query, location, isGpsActive, userCoords, radius, category, sortBy, verifiedOnly, payTypes]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const toggleArr = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleApply = async (jobId: string) => {
    if (!user) { navigate('/sign-in?redirect=/find-work'); return; }
    if (role !== 'worker') { alert('Only workers can apply for jobs'); return; }
    await applyForJob(jobId, workerProfileId || 'demo-wp-1', '');
  };

  const FiltersPanel = () => (
    <div className="flex flex-col gap-5">
      <div>
        <h4 className="label mb-3">{t('findWork.category')}</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="cat" checked={category === ''} onChange={() => setCategory('')} className="accent-[var(--primary)]" />
            {t('categories.all')}
          </label>
          {CATEGORIES.map(c => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c)} className="accent-[var(--primary)]" />
              {t(`categories.${c}`)}
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-100" />
      <div>
        <h4 className="label mb-3 flex items-center justify-between">
          <span>Distance Radius</span>
          {radius && <span className="text-xs text-[var(--primary)] font-semibold">{radius} km</span>}
        </h4>
        <div className="flex flex-col gap-2">
          {RADIUS_OPTIONS.map(opt => (
            <label key={opt.label} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="radius"
                checked={radius === opt.val}
                onChange={() => setRadius(opt.val)}
                className="accent-[var(--primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {!userCoords && !location && (
          <p className="text-xs text-gray-400 mt-2">
            Tip: Click &quot;Near Me&quot; or enter a city to activate distance sorting.
          </p>
        )}
      </div>
      <hr className="border-gray-100" />
      <div>
        <h4 className="label mb-3">{t('findWork.jobType')}</h4>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map(jt => (
            <label key={jt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={jobTypes.includes(jt)} onChange={() => toggleArr(jobTypes, jt, setJobTypes)} className="accent-[var(--primary)]" />
              {t(`findWork.${jt}`)}
            </label>
          ))}
        </div>
      </div>
      <hr className="border-gray-100" />
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="toggle-switch">
          <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
          <span className="toggle-slider" />
        </div>
        <span className="text-sm font-medium">{t('findWork.verifiedOnly')}</span>
      </label>
      <button onClick={() => { setCategory(''); setJobTypes([]); setPayTypes([]); setVerifiedOnly(false); clearLocation(); }}
        className="btn btn-ghost btn-sm text-gray-500">
        <X size={14} /> {t('btn.clearFilters')}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-20 md:pb-0">
      {/* Search Header */}
      <div className="hero-dark py-8">
        <div className="container relative z-10">
          <h1 className="text-2xl font-bold text-white mb-5">{t('findWork.title')}</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400" placeholder={t('findWork.searchPlaceholder')} value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <div className="relative md:w-64">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-10 pr-24 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                placeholder={t('findWork.locationPlaceholder')}
                value={location}
                onChange={e => {
                  setLocation(e.target.value);
                  if (isGpsActive) setIsGpsActive(false);
                }}
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                title="Detect my current location"
                disabled={locating}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs flex items-center gap-1 py-1 px-2 rounded-lg bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-100 font-medium transition-colors border border-indigo-400/30"
              >
                {locating ? <Loader2 size={11} className="animate-spin" /> : <LocateFixed size={11} />}
                <span>Near Me</span>
              </button>
            </div>
            <div className="relative md:w-52">
              <select className="select bg-white/10 border-white/20 text-white" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="" style={{ color: '#000' }}>{t('categories.all')}</option>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ color: '#000' }}>{t(`categories.${c}`)}</option>)}
              </select>
            </div>
            <button className="btn btn-primary px-6" onClick={loadJobs}>
              <Search size={16} /> {t('btn.search')}
            </button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> {t('findWork.filters')}
              </h3>
              <FiltersPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Location Awareness Banner */}
            {(isGpsActive || userCoords || location) && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-4 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Navigation size={15} className="text-indigo-600 fill-indigo-600 flex-shrink-0" />
                  <span>
                    Showing works near <strong>{location || 'your location'}</strong>
                    {radius ? ` (within ${radius} km)` : ''}
                  </span>
                </div>
                <button
                  onClick={clearLocation}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline flex-shrink-0"
                >
                  Clear location
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {t('misc.showing')} <strong>{total}</strong> {t('misc.results')}
              </p>
              <div className="flex items-center gap-2">
                <button className="lg:hidden btn btn-ghost btn-sm" onClick={() => setFilterOpen(true)}>
                  <SlidersHorizontal size={16} /> {t('btn.filter')}
                </button>
                <select className="select w-44 text-sm" style={{ height: '38px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">{t('findWork.newest')}</option>
                  <option value="closest">📍 Closest to Me</option>
                  <option value="highest_pay">{t('findWork.highestPay')}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={36} className="animate-spin text-indigo-500" />
              </div>
            ) : error ? (
              <div className="card text-center py-16">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="font-bold text-gray-900 mb-1">Something went wrong</h3>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <button className="btn btn-primary" onClick={loadJobs}>Try Again</button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-900 mb-1">{t('findWork.noResults')}</h3>
                <p className="text-gray-500 text-sm">{t('findWork.tryAdjusting')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 stagger-children">
                {jobs.map(job => <JobCard key={job.id} job={job} onApply={handleApply} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <>
          <div className="overlay" onClick={() => setFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t('findWork.filters')}</h3>
              <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
            </div>
            <FiltersPanel />
            <button className="btn btn-primary w-full mt-4" onClick={() => setFilterOpen(false)}>
              {t('btn.search')} ({total})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FindWork;
