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
      console.log('🔍 Testing Supabase connection...');
      
      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('Environment check:', {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        key: supabaseKey ? '✅ Set' : '❌ Missing'
      });
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return false;
      }
      
      // Test basic connection
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
    } catch (err) {
      console.error('❌ Supabase connection error:', err);
      return false;
    }
  };

  // Fetch categories (simplified - no manual count calculation)
  const fetchCategories = async () => {
    try {
      console.log('📂 Starting fetchCategories...');
      setLoading(true);
      setError(null);

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
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics for a category
  const fetchTopics = async (categoryId?: string) => {
    try {
      console.log('💬 Starting fetchTopics for category:', categoryId);
      setLoading(true);
      setError(null);
      
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
      console.log('📝 Starting fetchPosts for topic:', topicId);
      setLoading(true);
      setError(null);
      
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