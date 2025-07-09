import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Plus, Heart, Calendar, MapPin, Pin, Lock, Eye, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { stories } from '../data/stories';
import StoryCard from '../components/shared/StoryCard';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuthStore } from '../stores/authStore';
import { useForum } from '../hooks/useForum';
import CreateTopicModal from '../components/forum/CreateTopicModal';
import ConnectionDebugger from '../components/debug/ConnectionDebugger';
import { ForumTopic } from '../lib/supabase';

// Using a polyfill for @headlessui/react Tab component since we can't install it
const TabsPolyfill: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const TabList: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`flex border-b border-neutral-200 dark:border-neutral-700 ${className}`}>
    {children}
  </div>
);

const TabButton: React.FC<{
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}> = ({ children, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium border-b-2 transition-colors ${
      selected
        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
        : 'border-transparent text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-300'
    }`}
  >
    {children}
  </button>
);

const TabPanels: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const TabPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  selected: boolean;
}> = ({ children, className, selected }) => (
  selected ? <div className={className}>{children}</div> : null
);

const CommunityContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('connected');
  const [showDebugger, setShowDebugger] = useState(false);
  
  const { user } = useAuthStore();
  const { 
    categories, 
    topics, 
    loading, 
    error, 
    fetchCategories, 
    fetchTopics,
    setError
  } = useForum();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initialize forum immediately without connection testing
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('📂 Selected category changed to:', selectedCategory);
    if (categories.length > 0) {
      if (selectedCategory === 'all') {
        fetchTopics();
      } else {
        fetchTopics(selectedCategory);
      }
    }
  }, [selectedCategory, categories.length]);

  useEffect(() => {
    console.log('📊 Categories updated:', categories);
    // Set connection status based on whether we have categories
    if (categories.length > 0) {
      setConnectionStatus('connected');
    } else if (error) {
      setConnectionStatus('failed');
    }
  }, [categories]);

  useEffect(() => {
    console.log('💬 Topics updated:', topics);
  }, [topics]);

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

  const handleTopicCreated = () => {
    setShowCreateTopic(false);
    // Simple refresh - just refetch current data
    fetchCategories();
    if (selectedCategory === 'all') {
      fetchTopics();
    } else {
      fetchTopics(selectedCategory);
    }
  };

  const handleRetry = async () => {
    setConnectionStatus('checking');
    setError(null);
    await fetchCategories();
  };

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Virtual Homeschool Meetup - Portugal',
      date: '2024-01-15',
      time: '19:00 CET',
      location: 'Online',
      attendees: 23
    },
    {
      id: '2',
      title: 'Dublin Homeschool Park Day',
      date: '2024-01-18',
      time: '14:00 GMT',
      location: 'Phoenix Park, Dublin',
      attendees: 12
    },
    {
      id: '3',
      title: 'Barcelona Family Learning Exchange',
      date: '2024-01-22',
      time: '16:00 CET',
      location: 'Parc de la Ciutadella',
      attendees: 18
    }
  ];

  return (
    <main className="pt-28 pb-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Users size={24} className="text-primary-500" />
            <h1 className="text-4xl font-bold font-display text-neutral-800 dark:text-white">
              EUhomeschool Community
            </h1>
          </div>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Connect with other homeschooling families across Europe, share experiences, and find support for your educational journey.
          </p>
          
          {user && (
            <div className="mt-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-primary-800 dark:text-primary-200">
                Welcome back, <strong>{user.name}</strong>! 👋
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                Currently in {user.currentCountry} • Homeschooling in {user.preferredLanguage}
              </p>
            </div>
          )}
        </div>

        {/* Connection Status */}
        {connectionStatus === 'checking' && (
          <div className="text-center py-8 mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">Connecting to database...</p>
          </div>
        )}

        {connectionStatus === 'failed' && (
          <div className="mb-8">
            <div className="bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">🚨 Connection Failed</h3>
              <p className="mb-4">Unable to connect to Supabase. This might be due to:</p>
              <ul className="text-left list-disc list-inside mb-4 max-w-md mx-auto">
                <li>Missing or incorrect Supabase environment variables</li>
                <li>Using placeholder values in .env file</li>
                <li>Internet connection issues</li>
                <li>Supabase project configuration problems</li>
                <li>Database server issues</li>
              </ul>
              <div className="bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-200 p-4 rounded-lg mb-4">
                <p className="text-sm">
                  <strong>Quick Fix:</strong> Make sure your <code>.env</code> file contains your actual Supabase project URL and anonymous key, not the placeholder values.
                </p>
              </div>
              <div className="space-x-3">
                <button onClick={handleRetry} className="btn-primary">
                  Try Again
                </button>
                <button
                  onClick={() => setShowDebugger(!showDebugger)}
                  className="btn-outline"
                >
                  {showDebugger ? 'Hide' : 'Show'} Debug Info
                </button>
              </div>
            </div>
            
            {showDebugger && (
              <div className="mt-6">
                <ConnectionDebugger />
              </div>
            )}
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <TabsPolyfill className="mb-12">
                <TabList>
                  <TabButton
                    selected={activeTab === 'forum'}
                    onClick={() => setActiveTab('forum')}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={18} />
                      <span>Forum</span>
                    </div>
                  </TabButton>
                  <TabButton
                    selected={activeTab === 'stories'}
                    onClick={() => setActiveTab('stories')}
                  >
                    <div className="flex items-center space-x-2">
                      <Heart size={18} />
                      <span>Family Stories</span>
                    </div>
                  </TabButton>
                  <TabButton
                    selected={activeTab === 'events'}
                    onClick={() => setActiveTab('events')}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} />
                      <span>Events</span>
                    </div>
                  </TabButton>
                </TabList>
                
                <TabPanels>
                  <TabPanel selected={activeTab === 'forum'} className="py-6">
                    {/* Forum Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div className="flex items-center space-x-4">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                          disabled={categories.length === 0}
                        >
                          <option value="all">All Countries ({topics.length})</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name} ({category.topic_count})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        onClick={() => setShowCreateTopic(true)}
                        className="btn-primary flex items-center space-x-2"
                        disabled={categories.length === 0}
                      >
                        <Plus size={18} />
                        <span>New Topic</span>
                      </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200 p-4 rounded-lg mb-6">
                        <p><strong>Error:</strong> {error}</p>
                        <div className="mt-2 space-x-2">
                          <button 
                            onClick={() => setError(null)}
                            className="underline hover:no-underline"
                          >
                            Dismiss
                          </button>
                          <button 
                            onClick={handleRetry}
                            className="underline hover:no-underline"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Loading forum data...</p>
                      </div>
                    )}

                    {/* Categories Not Loaded */}
                    {!loading && categories.length === 0 && !error && (
                      <div className="text-center py-8">
                        <MessageSquare size={48} className="mx-auto text-neutral-400 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                          Loading forum categories...
                        </h3>
                        <p className="text-neutral-500 dark:text-neutral-500 mb-4">
                          Please wait while we set up the forum for you.
                        </p>
                      </div>
                    )}

                    {/* Topics List */}
                    {categories.length > 0 && (
                      <div className="space-y-4">
                        {topics.length > 0 ? (
                          topics.map((topic: ForumTopic) => (
                            <div key={topic.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    {topic.is_pinned && (
                                      <Pin size={16} className="text-primary-500" />
                                    )}
                                    {topic.is_locked && (
                                      <Lock size={16} className="text-neutral-500" />
                                    )}
                                    <Link
                                      to={`/community/topic/${topic.id}`}
                                      className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                      {topic.title}
                                    </Link>
                                  </div>
                                  
                                  <p className="text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                                    {topic.content.substring(0, 150)}...
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
                                      <MapPin size={14} />
                                      <span>{topic.category?.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1">
                                      <Clock size={14} />
                                      <span>{formatTimeAgo(topic.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right ml-4">
                                  <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle size={14} />
                                      <span>{topic.post_count}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Eye size={14} />
                                      <span>{topic.view_count}</span>
                                    </div>
                                  </div>
                                  
                                  {topic.last_post_author && (
                                    <div className="mt-2 text-xs text-neutral-400">
                                      Last by {topic.last_post_author.name}
                                      <br />
                                      {formatTimeAgo(topic.last_post_at)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <MessageSquare size={48} className="mx-auto text-neutral-400 mb-4" />
                            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                              No topics yet
                            </h3>
                            <p className="text-neutral-500 dark:text-neutral-500 mb-4">
                              Be the first to start a discussion in this category!
                            </p>
                            <button
                              onClick={() => setShowCreateTopic(true)}
                              className="btn-primary"
                            >
                              Start First Topic
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabPanel>

                  <TabPanel selected={activeTab === 'stories'} className="py-6">
                    <div className="space-y-8">
                      {stories.map(story => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  </TabPanel>

                  <TabPanel selected={activeTab === 'events'} className="py-6">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                        Upcoming Events
                      </h3>
                      
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                              {event.title}
                            </h4>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                              {event.attendees} attending
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <div className="flex items-center space-x-2">
                              <Calendar size={16} />
                              <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin size={16} />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          
                          <button className="mt-4 btn-outline text-sm py-2 px-4">
                            Join Event
                          </button>
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabsPolyfill>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
                    Forum Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">All Countries</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {topics.length}
                        </span>
                      </div>
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {category.topic_count}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {category.description}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h4 className="font-semibold text-lg mb-3 text-neutral-800 dark:text-neutral-100">
                    Community Guidelines
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>Be respectful and supportive of different homeschooling approaches</li>
                    <li>Share accurate, up-to-date information about regulations</li>
                    <li>Respect privacy and don't share others' personal information</li>
                    <li>Focus on constructive discussions about homeschooling in Europe</li>
                    <li>No spam or self-promotion without prior approval</li>
                  </ul>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                  <h4 className="font-semibold text-lg mb-3 text-neutral-800 dark:text-neutral-100">
                    Quick Links
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      📋 Homeschool Resources Library
                    </button>
                    <button className="w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      📅 Event Calendar
                    </button>
                    <button className="w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      🗺️ Member Map
                    </button>
                    <button className="w-full text-left text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      💬 Private Messaging
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={showCreateTopic}
        onClose={() => setShowCreateTopic(false)}
        categories={categories}
        onTopicCreated={handleTopicCreated}
      />
    </main>
  );
};

const CommunityPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <CommunityContent />
    </ProtectedRoute>
  );
};

export default CommunityPage;