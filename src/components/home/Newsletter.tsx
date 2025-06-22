import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      // In a real application, you would send the email to a backend service here
    }
  };

  const closeNewsletter = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 w-full max-w-md">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden animate-slideUp">
        <div className="relative bg-primary-600 dark:bg-primary-700 p-4 text-white flex justify-between items-center">
          <h3 className="font-display font-semibold">Stay Updated</h3>
          <button 
            onClick={closeNewsletter}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close newsletter"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {!isSubmitted ? (
            <>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                Subscribe to our newsletter to receive the latest updates on homeschooling regulations and communities across Europe.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Subscribe</span>
                  <Send size={18} />
                </button>
              </form>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckIcon className="w-8 h-8 text-success-600 dark:text-success-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2 text-neutral-800 dark:text-neutral-200">Thank You for Subscribing!</h4>
              <p className="text-neutral-600 dark:text-neutral-400">
                You'll receive our newsletter with the latest homeschooling updates across Europe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple checkmark icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default Newsletter;