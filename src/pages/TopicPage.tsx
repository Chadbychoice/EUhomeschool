import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Pin, Lock, Eye, Clock, MapPin, Send, Edit, Trash2 } from 'lucide-react';
import { useForum } from '../hooks/useForum';
import { useAuthStore } from '../stores/authStore';
import { ForumTopic, ForumPost } from '../lib/supabase';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const TopicContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { 
    posts, 
    loading, 
    fetchTopic, 
    fetchPosts, 
    createPost,
    setError: setForumError 
  } = useForum();

  useEffect(() => {
    if (id) {
      loadTopic();
      fetchPosts(id);
    }
  }, [id]);

  const loadTopic = async () => {
    if (!id) return;
    
    try {
      const topicData = await fetchTopic(id);
      setTopic(topicData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topic');
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newPostContent.trim()) return;

    setIsSubmittingPost(true);
    setError(null);

    try {
      await createPost(newPostContent.trim(), id);
      setNewPostContent('');
      // Refresh posts and topic (for updated counts)
      fetchPosts(id);
      loadTopic();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsSubmittingPost(false);
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

  if (loading && !topic) {
    return (
      <main className="pt-28 pb-16">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">Loading topic...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !topic) {
    return (
      <main className="pt-28 pb-16">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
              Topic Not Found
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {error}
            </p>
            <Link to="/community" className="btn-primary">
              Back to Community
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!topic) return null;

  return (
    <main className="pt-28 pb-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/community" 
            className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Community</span>
          </Link>
        </div>

        {/* Topic Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  {topic.is_pinned && (
                    <Pin size={20} className="text-primary-500" />
                  )}
                  {topic.is_locked && (
                    <Lock size={20} className="text-neutral-500" />
                  )}
                  <h1 className="text-2xl font-bold font-display text-neutral-800 dark:text-neutral-100">
                    {topic.title}
                  </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <img
                      src={topic.author?.avatar_url || getDefaultAvatar(topic.author?.name || 'User')}
                      alt={topic.author?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>by <strong>{topic.author?.name}</strong></span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{topic.category?.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{formatTimeAgo(topic.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={16} />
                    <span>{topic.post_count} replies</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Eye size={16} />
                    <span>{topic.view_count} views</span>
                  </div>
                </div>
              </div>
              
              {user && user.id === topic.author_id && (
                <div className="flex space-x-2 ml-4">
                  <button className="p-2 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-neutral-500 hover:text-error-600 dark:hover:text-error-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {topic.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4 mb-8">
          {posts.map((post: ForumPost, index) => (
            <div key={post.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author?.avatar_url || getDefaultAvatar(post.author?.name || 'User')}
                      alt={post.author?.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-neutral-800 dark:text-neutral-100">
                        {post.author?.name}
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        #{index + 1} • {formatTimeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {user && user.id === post.author_id && (
                    <div className="flex space-x-2">
                      <button className="p-1 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-neutral-500 hover:text-error-600 dark:hover:text-error-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {!topic.is_locked ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
              Reply to this topic
            </h3>
            
            {error && (
              <div className="bg-error-50 dark:bg-error-900/20 text-error-800 dark:text-error-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white mb-4"
                placeholder="Share your thoughts..."
                required
              />
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingPost || !newPostContent.trim()}
                  className={`btn-primary flex items-center space-x-2 ${
                    isSubmittingPost || !newPostContent.trim() 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  <Send size={18} />
                  <span>{isSubmittingPost ? 'Posting...' : 'Post Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 text-center">
            <Lock size={24} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-neutral-600 dark:text-neutral-400">
              This topic has been locked and no longer accepts new replies.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

const TopicPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <TopicContent />
    </ProtectedRoute>
  );
};

export default TopicPage;