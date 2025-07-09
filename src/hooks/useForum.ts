import { useState, useEffect } from 'react';
import { supabase, ForumCategory, ForumTopic, ForumPost } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export const useForum = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  // Test Supabase connection
  const testConnection = async () => {
    try {
      console.log('🔍 Testing Supabase connection for forum...');
      
      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Environment check:', {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        key: supabaseKey ? '✅ Set' : '❌ Missing'
      });
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
        console.error('❌ Missing Supabase environment variables');
        return false;
      }
      
      // Test basic connection
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
          
        if (error) {
          console.error('❌ Supabase connection test failed:', error);
          return false;
        }
        
        console.log('✅ Supabase connection successful');
        return true;
      } catch (connectionError) {
        console.error('❌ Supabase connection error:', connectionError);
        return false;
      }
    } catch (err) {
      console.error('❌ Supabase connection error:', err);
      return false;
    }
  };

  // Fetch categories (simplified - no manual count calculation)
  const fetchCategories = async () => {
    try {
      console.log('📂 Fetching forum categories...');
      setLoading(true);
      setError(null);

      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
        console.log('📂 Using mock categories data');
        const mockCategories = [
          { id: '1', name: 'General Discussion', slug: 'general', description: 'General homeschooling discussions', country_code: null, topic_count: 5, post_count: 23, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '2', name: 'Portugal', slug: 'portugal', description: 'Discussions about homeschooling in Portugal', country_code: 'PT', topic_count: 3, post_count: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '3', name: 'Ireland', slug: 'ireland', description: 'Discussions about homeschooling in Ireland', country_code: 'IE', topic_count: 2, post_count: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: '4', name: 'Spain', slug: 'spain', description: 'Discussions about homeschooling in Spain', country_code: 'ES', topic_count: 4, post_count: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
        ];
        setCategories(mockCategories);
        setLoading(false);
        return;
      }

      try {
        console.log('📂 Fetching categories from Supabase...');
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('❌ Supabase error fetching categories:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('📂 Raw categories data:', data);
        
        if (!data) {
          console.warn('⚠️ No categories data returned');
          setCategories([]);
          return;
        }

        console.log(`✅ Successfully fetched ${data.length} categories`);
        setCategories(data);
      } catch (supabaseError) {
        console.error('❌ Supabase query failed:', supabaseError);
        throw supabaseError;
      }
    } catch (err) {
      console.error('❌ Categories fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics for a category
  const fetchTopics = async (categoryId?: string) => {
    try {
      console.log('💬 Fetching topics for category:', categoryId);
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
        console.log('💬 Using mock topics data');
        const mockTopics = [
          {
            id: '1',
            title: 'Welcome to EUhomeschool Community!',
            content: 'This is a sample topic to demonstrate the forum functionality. Once you configure Supabase, you\'ll be able to create real discussions.',
            author_id: 'mock-user',
            category_id: categoryId || '1',
            is_pinned: true,
            is_locked: false,
            view_count: 45,
            post_count: 3,
            last_post_at: new Date().toISOString(),
            last_post_author_id: 'mock-user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            author: { name: 'Demo User', avatar_url: null },
            category: { name: 'General Discussion', slug: 'general' },
            last_post_author: { name: 'Demo User' }
          }
        ];
        setTopics(mockTopics);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('forum_topics')
          .select(`
            *,
            author:profiles!forum_topics_author_id_fkey(name, avatar_url),
            category:forum_categories!forum_topics_category_id_fkey(name, slug),
            last_post_author:profiles!forum_topics_last_post_author_id_fkey(name)
          `)
          .order('is_pinned', { ascending: false })
          .order('last_post_at', { ascending: false });

        if (categoryId && categoryId !== 'all') {
          query = query.eq('category_id', categoryId);
        }

        console.log('💬 Executing topics query...');
        const { data, error } = await query;

        if (error) {
          console.error('❌ Supabase error fetching topics:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('💬 Raw topics data:', data);
        console.log(`✅ Successfully fetched ${data?.length || 0} topics`);
        setTopics(data || []);
      } catch (supabaseError) {
        console.error('❌ Supabase topics query failed:', supabaseError);
        throw supabaseError;
      }
    } catch (err) {
      console.error('❌ Topics fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch topics';
      setError(errorMessage);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts for a topic
  const fetchPosts = async (topicId: string) => {
    try {
      console.log('📝 Fetching posts for topic:', topicId);
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles!forum_posts_author_id_fkey(name, avatar_url)
          `)
          .eq('topic_id', topicId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('❌ Supabase error fetching posts:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        console.log('📝 Raw posts data:', data);
        console.log(`✅ Successfully fetched ${data?.length || 0} posts`);
        setPosts(data || []);
      } catch (supabaseError) {
        console.error('❌ Supabase posts query failed:', supabaseError);
        throw supabaseError;
      }
    } catch (err) {
      console.error('❌ Posts fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      setError(errorMessage);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new topic
  const createTopic = async (title: string, content: string, categoryId: string) => {
    if (!user) throw new Error('Must be logged in to create topics');
    
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
      throw new Error('Forum functionality requires Supabase configuration. Please set up your environment variables.');
    }

    try {
      console.log('✏️ Creating topic:', { title, categoryId, userId: user.id });
      setError(null);
      
      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          title,
          content,
          author_id: user.id,
          category_id: categoryId
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating topic:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('✅ Successfully created topic:', data);
      return data;
    } catch (err) {
      console.error('❌ Topic creation error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create topic');
    }
  };

  // Create a new post
  const createPost = async (content: string, topicId: string) => {
    if (!user) throw new Error('Must be logged in to create posts');
    
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
      throw new Error('Forum functionality requires Supabase configuration. Please set up your environment variables.');
    }

    try {
      console.log('✏️ Creating post:', { topicId, userId: user.id });
      setError(null);
      
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          content,
          author_id: user.id,
          topic_id: topicId
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating post:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('✅ Successfully created post:', data);
      return data;
    } catch (err) {
      console.error('❌ Post creation error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  // Get a single topic with details
  const fetchTopic = async (topicId: string) => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
      throw new Error('Forum functionality requires Supabase configuration. Please set up your environment variables.');
    }
    
    try {
      console.log('📖 Fetching topic:', topicId);
      setError(null);
      
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles!forum_topics_author_id_fkey(name, avatar_url),
          category:forum_categories!forum_topics_category_id_fkey(name, slug)
        `)
        .eq('id', topicId)
        .single();

      if (error) {
        console.error('❌ Supabase error fetching topic:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      // Increment view count
      await supabase
        .from('forum_topics')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', topicId);

      console.log('✅ Successfully fetched topic:', data);
      return data;
    } catch (err) {
      console.error('❌ Topic fetch error:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch topic');
    }
  };

  // Fetch topics and posts by country name for country detail pages
  const fetchCountryForumData = async (countryName: string) => {
    try {
      console.log('🌍 Fetching forum data for country:', countryName);
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url' || supabaseKey === 'your_supabase_anon_key') {
        console.log('🌍 Using mock country forum data for:', countryName);
        
        // Return mock data for the specific country
        const mockTopics = [
          {
            id: `mock-topic-${countryName.toLowerCase()}`,
            title: `Welcome to ${countryName} Homeschooling Community!`,
            content: `This is a sample discussion topic for ${countryName}. Once you configure Supabase, you'll see real community discussions here.`,
            author_id: 'mock-user',
            category_id: 'mock-category',
            is_pinned: false,
            is_locked: false,
            view_count: 25,
            post_count: 5,
            last_post_at: new Date().toISOString(),
            last_post_author_id: 'mock-user',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            updated_at: new Date().toISOString(),
            author: { name: 'Demo User', avatar_url: null },
            category: { name: countryName, slug: countryName.toLowerCase() },
            last_post_author: { name: 'Demo User' }
          },
          {
            id: `mock-topic-2-${countryName.toLowerCase()}`,
            title: `Best Resources for Homeschooling in ${countryName}`,
            content: `Let's share the best homeschooling resources and curriculum options available in ${countryName}. What has worked well for your family?`,
            author_id: 'mock-user-2',
            category_id: 'mock-category',
            is_pinned: false,
            is_locked: false,
            view_count: 18,
            post_count: 3,
            last_post_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            last_post_author_id: 'mock-user-2',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            updated_at: new Date().toISOString(),
            author: { name: 'Sarah M.', avatar_url: null },
            category: { name: countryName, slug: countryName.toLowerCase() },
            last_post_author: { name: 'Sarah M.' }
          }
        ];
        
        const mockPosts = [
          {
            id: `mock-post-1-${countryName.toLowerCase()}`,
            content: `We've been homeschooling in ${countryName} for 2 years now and it's been an amazing experience. The local community is very supportive and there are great resources available.`,
            author_id: 'mock-user',
            topic_id: `mock-topic-${countryName.toLowerCase()}`,
            created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            updated_at: new Date().toISOString(),
            author: { name: 'Demo User', avatar_url: null },
            topic: { title: `Welcome to ${countryName} Homeschooling Community!` }
          },
          {
            id: `mock-post-2-${countryName.toLowerCase()}`,
            content: `I highly recommend checking out the local library system in ${countryName} - they have excellent educational programs and resources for homeschooling families.`,
            author_id: 'mock-user-2',
            topic_id: `mock-topic-2-${countryName.toLowerCase()}`,
            created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            updated_at: new Date().toISOString(),
            author: { name: 'Sarah M.', avatar_url: null },
            topic: { title: `Best Resources for Homeschooling in ${countryName}` }
          },
          {
            id: `mock-post-3-${countryName.toLowerCase()}`,
            content: `The registration process in ${countryName} was straightforward. Make sure to have all your documents ready and translated if needed. Happy to help other families with questions!`,
            author_id: 'mock-user-3',
            topic_id: `mock-topic-${countryName.toLowerCase()}`,
            created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
            updated_at: new Date().toISOString(),
            author: { name: 'Michael K.', avatar_url: null },
            topic: { title: `Welcome to ${countryName} Homeschooling Community!` }
          }
        ];
        
        setLoading(false);
        return { 
          topics: mockTopics, 
          posts: mockPosts 
        };
      }
      
      // First, find the category for this country
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .ilike('name', `%${countryName}%`)
        .single();

      if (categoryError) {
        console.log('⚠️ No category found for country:', countryName);
        return { topics: [], posts: [] };
      }

      // Fetch topics for this country
      const { data: topicsData, error: topicsError } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles!forum_topics_author_id_fkey(name, avatar_url),
          category:forum_categories!forum_topics_category_id_fkey(name, slug),
          last_post_author:profiles!forum_topics_last_post_author_id_fkey(name)
        `)
        .eq('category_id', categoryData.id)
        .order('is_pinned', { ascending: false })
        .order('last_post_at', { ascending: false })
        .limit(5); // Limit to 5 most recent topics for country pages

      if (topicsError) {
        console.error('❌ Error fetching topics for country:', topicsError);
        return { topics: [], posts: [] };
      }

      // Fetch posts for these topics
      const topicIds = topicsData?.map(topic => topic.id) || [];
      let postsData: any[] = [];
      
      if (topicIds.length > 0) {
        const { data: posts, error: postsError } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles!forum_posts_author_id_fkey(name, avatar_url),
            topic:forum_topics!forum_posts_topic_id_fkey(title)
          `)
          .in('topic_id', topicIds)
          .order('created_at', { ascending: false })
          .limit(10); // Limit to 10 most recent posts

        if (!postsError) {
          postsData = posts || [];
        }
      }

      console.log(`✅ Successfully fetched ${topicsData?.length || 0} topics and ${postsData.length} posts for ${countryName}`);
      return { 
        topics: topicsData || [], 
        posts: postsData 
      };
    } catch (err) {
      console.error('❌ Error fetching country forum data:', err);
      return { topics: [], posts: [] };
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    topics,
    posts,
    loading,
    error,
    fetchCategories,
    fetchTopics,
    fetchPosts,
    fetchTopic,
    createTopic,
    createPost,
    fetchCountryForumData,
    testConnection
  };
};