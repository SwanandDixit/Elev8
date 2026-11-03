import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/privacy':  'Privacy Policy',
  '/terms':    'Terms of Service',
  '/help':     'Help Center',
  '/contact':  'Contact Us',
  '/safety':   'Safety Tips',
};

const ComingSoon: React.FC = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'Page';

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <div className="card max-w-md w-full text-center p-10">
        <div className="text-5xl mb-4">🚧</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 mb-8">
          This page is coming soon. We're working hard to bring you this content.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
