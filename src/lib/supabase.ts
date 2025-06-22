import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase configuration check:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Set' : '❌ Missing',
  urlValue: supabaseUrl || 'undefined',
  keyLength: supabaseAnonKey ? `${supabaseAnonKey.length} chars` : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl || 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '[HIDDEN]' : 'undefined'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-client-info': 'euhomeschool-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

console.log('✅ Supabase client initialized successfully');

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          current_country: string;
          preferred_language: string;
          avatar_url: string | null;
          membership_type: 'free' | 'premium';
          joined_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          current_country: string;
          preferred_language: string;
          avatar_url?: string | null;
          membership_type?: 'free' | 'premium';
          joined_date?: string;
        };
        Update: {
          name?: string;
          current_country?: string;
          preferred_language?: string;
          avatar_url?: string | null;
          membership_type?: 'free' | 'premium';
        };
      };
      forum_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          country_code: string | null;
          topic_count: number;
          post_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          country_code?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          country_code?: string | null;
        };
      };
      forum_topics: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          category_id: string;
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          post_count: number;
          last_post_at: string;
          last_post_author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          author_id: string;
          category_id: string;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
      };
      forum_posts: {
        Row: {
          id: string;
          content: string;
          author_id: string;
          topic_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          author_id: string;
          topic_id: string;
        };
        Update: {
          content?: string;
        };
      };
    };
  };
}

// Forum-related types
export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country_code: string | null;
  topic_count: number;
  post_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  post_count: number;
  last_post_at: string;
  last_post_author_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    name: string;
    avatar_url: string | null;
  };
  category?: {
    name: string;
    slug: string;
  };
  last_post_author?: {
    name: string;
  };
}

export interface ForumPost {
  id: string;
  content: string;
  author_id: string;
  topic_id: string;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    name: string;
    avatar_url: string | null;
  };
}