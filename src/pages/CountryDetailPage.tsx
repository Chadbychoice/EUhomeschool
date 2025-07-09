import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Book, Globe, Users, PlusCircle, Check, X, MessageSquare, Clock, Eye, MessageCircle } from 'lucide-react';
import { getCountryById } from '../data/countries';
import { useForum } from '../hooks/useForum';
import { motion } from 'framer-motion';

const CountryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'rules' | 'languages' | 'communities'>('rules');
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [forumData, setForumData] = useState<{ topics: any[], posts: any[] }>({ topics: [], posts: [] });
  const [isLoadingForum, setIsLoadingForum] = useState(false);
  const [forumError, setForumError] = useState<string | null>(null);
  
  const country = id ? getCountryById(id) : undefined;
  const { fetchCountryForumData } = useForum();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const loadForumData = async () => {
      if (country) {
        console.log('🌍 Loading forum data for country:', country.name);
        setIsLoadingForum(true);
        setForumError(null);
        try {
          const data = await fetchCountryForumData(country.name);
          console.log('🌍 Forum data loaded:', data);
          setForumData(data);
        } catch (error) {
          console.error('🌍 Error loading forum data:', error);
          setForumError(error instanceof Error ? error.message : 'Failed to load forum data');
        } finally {
          setIsLoadingForum(false);
        }
      }
    };

    loadForumData();
  }, [country, fetchCountryForumData]);

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

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'green': return <Check className="text-success-600 dark:text-success-400" />;
      case 'yellow': return <PlusCircle className="text-warning-600 dark:text-warning-400" />;
      case 'red': return <X className="text-error-600 dark:text-error-400" />;
      default: return null;
    }
  };

  const getVerdictClass = (verdict: string) => {
    switch (verdict) {
      case 'green': return 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800';
      case 'yellow': return 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800';
      case 'red': return 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800';
      default: return 'bg-neutral-50 dark:bg-neutral-900/20 border-neutral-200 dark:border-neutral-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getDefaultAvatar = (name: string): string => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=ffffff&size=80&font-size=0.6`;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;

    setIsSubmittingComment(true);
    
    // Simulate API call
    setTimeout(() => {
      setCommentSubmitted(true);
      setCommentName('');
      setCommentContent('');
      setIsSubmittingComment(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => setCommentSubmitted(false), 3000);
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
            <div className={`p-4 rounded-lg mb-6 flex items-center space-x-3 border ${getVerdictClass(country.verdict)}`}>
              <div className="p-2 rounded-full bg-white bg-opacity-20">
                {getVerdictIcon(country.verdict)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  Homeschooling in {country.name} is {getVerdictLabel(country.verdict).toLowerCase()}
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Based on current regulations and community feedback
                </p>
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
            {isLoadingForum && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                  Recent Community Discussions
                </h3>
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-neutral-500 dark:text-neutral-400">Loading community discussions...</p>
                </div>
              </div>
            )}

            {!isLoadingForum && forumError && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                  Recent Community Discussions
                </h3>
                <div className="bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200 p-6 rounded-lg text-center">
                  <p className="mb-2">Unable to load community discussions</p>
                  <p className="text-sm">{forumError}</p>
                </div>
              </div>
            )}

            {!isLoadingForum && !forumError && forumData.topics.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                  Recent Community Discussions
                </h3>
                <div className="space-y-6">
                  {forumData.topics.map(topic => (
                    <div key={topic.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-neutral-800 dark:text-neutral-100 mb-2">
                            {topic.title}
                          </h4>
                          <p className="text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-3">
                            {topic.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center space-x-1">
                              <img
                                src={topic.author?.avatar_url || getDefaultAvatar(topic.author?.name || 'User')}
                                alt={topic.author?.name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{topic.author?.name}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{formatTimeAgo(topic.created_at)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={14} />
                              <span>{topic.post_count || 0} replies</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Eye size={14} />
                              <span>{topic.view_count || 0} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link 
                    to="/community" 
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <MessageSquare size={18} />
                    <span>View All Discussions</span>
                  </Link>
                </div>
              </div>
            )}

            {!isLoadingForum && !forumError && forumData.topics.length === 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                  Recent Community Discussions
                </h3>
                <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <MessageSquare size={48} className="mx-auto text-neutral-400 mb-4" />
                  <h4 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                    No discussions yet for {country.name}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-500 mb-4">
                    Be the first to start a discussion about homeschooling in {country.name}!
                  </p>
                  <Link 
                    to="/community" 
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <MessageSquare size={18} />
                    <span>Start Discussion</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 font-display text-neutral-800 dark:text-neutral-100">
                Community Discussions
              </h3>

              <div className="space-y-4 mb-8">
                {isLoadingForum && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-neutral-500 dark:text-neutral-400">Loading discussions...</p>
                  </div>
                )}

                {!isLoadingForum && !forumError && forumData.posts.length > 0 && (
                  forumData.posts.slice(0, 5).map(post => (
                    <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={post.author?.avatar_url || getDefaultAvatar(post.author?.name || 'User')}
                          alt={post.author?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-semibold text-neutral-800 dark:text-neutral-100">
                              {post.author?.name}
                            </h5>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                              {formatTimeAgo(post.created_at)}
                            </span>
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300 mb-2">
                            {post.content}
                          </p>
                          {post.topic && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              In: <span className="font-medium">{post.topic.title}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {!isLoadingForum && !forumError && forumData.posts.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare size={48} className="mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                      No discussions yet
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-500 mb-4">
                      Be the first to start a discussion about homeschooling in {country.name}!
                    </p>
                    <Link 
                      to="/community" 
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <MessageSquare size={18} />
                      <span>Start Discussion</span>
                    </Link>
                  </div>
                )}

                {!isLoadingForum && forumError && (
                  <div className="bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200 p-6 rounded-lg text-center">
                    <p className="mb-2">Unable to load recent posts</p>
                    <p className="text-sm">{forumError}</p>
                    <Link 
                      to="/community" 
                      className="btn-primary inline-flex items-center space-x-2 mt-4"
                    >
                      <MessageSquare size={18} />
                      <span>Visit Community Forum</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                <h4 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
                  Share Your Experience
                </h4>
                
                {commentSubmitted ? (
                  <div className="bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-200 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Check size={20} />
                      <span>Thank you for sharing your experience!</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComment}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Your Experience
                      </label>
                      <textarea
                        id="comment"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                        placeholder="Share your homeschooling experience in this country..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmittingComment}
                      className={`btn-primary ${isSubmittingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmittingComment ? 'Submitting...' : 'Share Experience'}
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