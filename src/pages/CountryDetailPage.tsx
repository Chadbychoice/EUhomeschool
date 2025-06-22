import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Book, Globe, Users, PlusCircle, Check, X } from 'lucide-react';
import { getCountryById } from '../data/countries';
import { getCommentsByCountry } from '../data/comments';
import { getStoriesByCountry } from '../data/stories';
import CommentCard from '../components/shared/CommentCard';
import StoryCard from '../components/shared/StoryCard';
import { motion } from 'framer-motion';

const CountryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'rules' | 'languages' | 'communities'>('rules');
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  
  const country = id ? getCountryById(id) : undefined;
  const comments = id ? getCommentsByCountry(id) : [];
  const stories = id ? getStoriesByCountry(id) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!country) {
    return (
      <div className="container-custom pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Country not found</h1>
        <Link to="/destinations" className="btn-primary">
          Back to Destinations
        </Link>
      </div>
    );
  }

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case 'green': return 'Easy';
      case 'yellow': return 'Possible but regulated';
      case 'red': return 'Basically impossible';
      default: return 'Unknown';
    }
  };

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'green': return 'verdict-green';
      case 'yellow': return 'verdict-yellow';
      case 'red': return 'verdict-red';
      default: return '';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'green': return <Check className="text-success-600 dark:text-success-400" />;
      case 'yellow': return <PlusCircle className="text-warning-600 dark:text-warning-400" />;
      case 'red': return <X className="text-error-600 dark:text-error-400" />;
      default: return null;
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmittingComment(false);
      setCommentSubmitted(true);
      setCommentName('');
      setCommentContent('');
      
      // Reset after showing success message
      setTimeout(() => {
        setCommentSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <main className="pt-16">
      {/* Hero Section */}
      <div 
        className="relative h-[40vh] min-h-[300px] flex items-center"
        style={{ 
          backgroundImage: `url(${country.headerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        
        <div className="container-custom relative z-10 text-white pt-20">
          <Link 
            to="/destinations" 
            className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to all destinations</span>
          </Link>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {country.name}
          </motion.h1>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Verdict Banner */}
            <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 ${getVerdictClass(country.verdict)}`}>
              <div className="p-2 rounded-full bg-white bg-opacity-20">
                {getVerdictIcon(country.verdict)}
              </div>
              <div>
                <span className="font-semibold text-lg">Homeschooling Status: {getVerdictLabel(country.verdict)}</span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={() => setActiveTab('rules')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                    activeTab === 'rules'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Book size={18} />
                    <span>Homeschooling Rules</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('languages')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                    activeTab === 'languages'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Globe size={18} />
                    <span>Language Options</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('communities')}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                    activeTab === 'communities'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span>Local Communities</span>
                  </div>
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'rules' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 font-display text-neutral-800 dark:text-neutral-100">Homeschooling Rules</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {country.rules}
                    </p>
                  </div>
                )}
                
                {activeTab === 'languages' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 font-display text-neutral-800 dark:text-neutral-100">Language Options</h3>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {country.languages}
                    </p>
                  </div>
                )}
                
                {activeTab === 'communities' && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 font-display text-neutral-800 dark:text-neutral-100">Local Communities</h3>
                    <div className="space-y-6">
                      {country.communities.map((community, index) => (
                        <div key={index} className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                          <h4 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100">{community.name}</h4>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                            <strong>Location:</strong> {community.location}
                          </p>
                          <p className="text-neutral-700 dark:text-neutral-300">
                            <strong>Activities:</strong> {community.activities}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience Stories Section */}
            {stories.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                  Family Experiences in {country.name}
                </h3>
                <div className="space-y-8">
                  {stories.map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                Community Discussions
              </h3>

              <div className="space-y-4 mb-8">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-neutral-500 dark:text-neutral-400 italic">
                    No comments yet. Be the first to share your experience!
                  </p>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                <h4 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
                  Share Your Experience
                </h4>
                
                {commentSubmitted ? (
                  <div className="bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200 p-4 rounded-lg mb-4">
                    Thank you for sharing your experience! Your comment will be reviewed and posted soon.
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Your Experience
                      </label>
                      <textarea
                        id="comment"
                        rows={4}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        placeholder="Share your experience homeschooling in this country..."
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmittingComment}
                      className={`btn-primary w-full ${isSubmittingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
                Key Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Monthly Cost of Living (family of 4)
                  </h4>
                  <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                    €{country.costOfLiving}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Average Internet Speed
                  </h4>
                  <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                    {country.internetSpeed} Mbps
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Homeschooling Community Strength
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xl ${i < country.communityStrength ? 'text-accent-500' : 'text-neutral-300 dark:text-neutral-700'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Pros
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {country.pros.map((pro, index) => (
                      <li key={index} className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Cons
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {country.cons.map((con, index) => (
                      <li key={index} className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <Link 
                    to="/destinations" 
                    className="btn-outline w-full justify-center"
                  >
                    Compare With Other Countries
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CountryDetailPage;