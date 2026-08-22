import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import { MOCK_JOBS } from '../lib/mockData';

const CATEGORIES = ['electrician','plumber','carpenter','cook','cleaning','driver','security','painter','welder','mason','acTech','gardener'];
const JOB_TYPES = ['fullTime','partTime','contract','emergency','weekend','evening'];

const FindWork: React.FC = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(params.get('category') || '');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [payTypes, setPayTypes] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let jobs = [...MOCK_JOBS];
    if (query) jobs = jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase()) || j.description.toLowerCase().includes(query.toLowerCase()));
    if (location) jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    if (category) jobs = jobs.filter(j => j.category === category);
    if (verifiedOnly) jobs = jobs.filter(j => j.employer?.is_verified);
    if (sortBy === 'newest') jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sortBy === 'highest_pay') jobs.sort((a, b) => b.pay_rate - a.pay_rate);
    return jobs;
  }, [query, location, category, jobTypes, payTypes, verifiedOnly, sortBy]);

  const toggleArr = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
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
      <button onClick={() => { setCategory(''); setJobTypes([]); setPayTypes([]); setVerifiedOnly(false); }}
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
            <div className="relative md:w-56">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400" placeholder={t('findWork.locationPlaceholder')} value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="relative md:w-52">
              <select className="select bg-white/10 border-white/20 text-white" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="" style={{ color: '#000' }}>{t('categories.all')}</option>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ color: '#000' }}>{t(`categories.${c}`)}</option>)}
              </select>
            </div>
            <button className="btn btn-primary px-6">
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
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {t('misc.showing')} <strong>{filtered.length}</strong> {t('misc.results')}
              </p>
              <div className="flex items-center gap-2">
                <button className="lg:hidden btn btn-ghost btn-sm" onClick={() => setFilterOpen(true)}>
                  <SlidersHorizontal size={16} /> {t('btn.filter')}
                </button>
                <select className="select w-44 text-sm" style={{ height: '38px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">{t('findWork.newest')}</option>
                  <option value="highest_pay">{t('findWork.highestPay')}</option>
                  <option value="closest">{t('findWork.closest')}</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-gray-900 mb-1">{t('findWork.noResults')}</h3>
                <p className="text-gray-500 text-sm">{t('findWork.tryAdjusting')}</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 stagger-children">
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <>
          <div className="overlay" onClick={() => setFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">{t('findWork.filters')}</h3>
              <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
            </div>
            <FiltersPanel />
            <button className="btn btn-primary w-full mt-4" onClick={() => setFilterOpen(false)}>
              {t('btn.search')} ({filtered.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FindWork;
