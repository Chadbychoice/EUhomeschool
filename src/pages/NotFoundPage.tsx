import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container-custom text-center py-16">
        <h1 className="text-6xl font-bold font-display text-primary-600 dark:text-primary-400 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6 text-neutral-800 dark:text-neutral-100">Page Not Found</h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Home size={18} />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;