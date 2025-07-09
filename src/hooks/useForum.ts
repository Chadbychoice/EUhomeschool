import { useState, useEffect } from 'react';
import { supabase, isSupabaseReady, ForumCategory, ForumTopic, ForumPost } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export const useForum = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      console.log('📂 Fetching forum categories...');
      setLoading(true);
      setError(null);

      if (!isSupabaseReady) {
        console.log('📂 Using mock categories data (Supabase not configured)');
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
    } catch (err) {
      console.error('❌ Categories fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      // Don't clear categories on error - let mock data show if available
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
      
      if (!isSupabaseReady) {
        console.log('💬 Using mock topics data (Supabase not configured)');
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
      
      if (!isSupabaseReady) {
        console.log('📝 Supabase not configured - cannot fetch posts');
        setPosts([]);
        setLoading(false);
        return;
      }
      
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
    
    if (!isSupabaseReady) {
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
    
    if (!isSupabaseReady) {
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
    if (!isSupabaseReady) {
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
      setError(null);
      
      if (!isSupabaseReady) {
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
        
        console.log('🌍 Returning mock data for', countryName, '- Topics:', mockTopics.length, 'Posts:', mockPosts.length);
        return { 
          topics: mockTopics, 
          posts: mockPosts 
        };
      }
      
      console.log('🌍 Fetching real data from Supabase for:', countryName);
      
      // First, find the category for this country
      const { data: categoryData, error: categoryError } = await supabase
        .from('forum_categories')
        .select('*')
        .ilike('name', `%${countryName}%`)
        .single();

      if (categoryError) {
        console.log('⚠️ No category found for country:', countryName, categoryError.message);
        return { topics: [], posts: [] };
      }

      console.log('🌍 Found category for', countryName, ':', categoryData.name);

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
        throw new Error(`Failed to fetch topics: ${topicsError.message}`);
      }

      console.log('🌍 Found', topicsData?.length || 0, 'topics for', countryName);

      // Fetch posts for these topics
      const topicIds = topicsData?.map(topic => topic.id) || [];
      let postsData: any[] = [];
      
      if (topicIds.length > 0) {
        console.log('🌍 Fetching posts for topic IDs:', topicIds);
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

        if (postsError) {
          console.error('❌ Error fetching posts:', postsError);
          // Don't throw error for posts, just log it
        } else {
          postsData = posts || [];
          console.log('🌍 Found', postsData.length, 'posts for', countryName);
        }
      } else {
        console.log('🌍 No topics found, so no posts to fetch for', countryName);
      }

      console.log(`✅ Successfully fetched ${topicsData?.length || 0} topics and ${postsData.length} posts for ${countryName}`);
      return { 
        topics: topicsData || [], 
        posts: postsData 
      };
    } catch (err) {
      console.error('❌ Error fetching country forum data:', err);
      throw err; // Re-throw to let the calling component handle the error
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
  };
};