import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
              Community Access Required
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Join our community to connect with other homeschooling families across Europe, share experiences, and access exclusive resources.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary"
            >
              Join Community
            </button>
          </div>
        </div>
        
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          initialMode="register"
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;