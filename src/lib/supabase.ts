import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Supabase configuration check:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Set' : '❌ Missing',
  urlValue: supabaseUrl || 'undefined',
  keyLength: supabaseAnonKey ? `${supabaseAnonKey.length} chars` : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('❌ Missing Supabase environment variables:', {
    VITE_SUPABASE_URL: supabaseUrl || 'undefined',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '[HIDDEN]' : 'undefined'
  });
  console.warn('⚠️ Supabase not configured - using mock mode');
}

// Create a mock client if Supabase is not configured
const createMockSupabaseClient = () => {
  const mockQueryBuilder = {
    select: function(columns?: string) { 
      console.log('🔧 Mock: select called with:', columns);
      return this; 
    },
    insert: function(data: any) { 
      console.log('🔧 Mock: insert called with:', data);
      return Promise.resolve({ data: null, error: { message: 'Supabase not configured - using mock mode' } }); 
    },
    update: function(data: any) { 
      console.log('🔧 Mock: update called with:', data);
      return Promise.resolve({ data: null, error: { message: 'Supabase not configured - using mock mode' } }); 
    },
    delete: function() { 
      console.log('🔧 Mock: delete called');
      return Promise.resolve({ data: null, error: { message: 'Supabase not configured - using mock mode' } }); 
    },
    eq: function(column: string, value: any) { 
      console.log('🔧 Mock: eq called with:', column, value);
      return this; 
    },
    single: function() { 
      console.log('🔧 Mock: single called');
      return Promise.resolve({ data: null, error: { message: 'Supabase not configured - using mock mode' } }); 
    },
    limit: function(count: number) { 
      console.log('🔧 Mock: limit called with:', count);
      return this; 
    },
    order: function(column: string, options?: any) { 
      console.log('🔧 Mock: order called with:', column, options);
      return this; 
    },
    ilike: function(column: string, pattern: string) { 
      console.log('🔧 Mock: ilike called with:', column, pattern);
      return this; 
    },
    in: function(column: string, values: any[]) { 
      console.log('🔧 Mock: in called with:', column, values);
      return this; 
    },
    then: function(onResolve: any, onReject?: any) {
      console.log('🔧 Mock: Promise.then called');
      return Promise.resolve({ data: [], error: null }).then(onResolve, onReject);
    },
    catch: function(onReject: any) {
      console.log('🔧 Mock: Promise.catch called');
      return Promise.resolve({ data: [], error: null }).catch(onReject);
    }
  };

  return {
    from: (table: string) => {
      console.log('🔧 Mock: from called with table:', table);
      return mockQueryBuilder;
    },
    auth: {
      signInWithPassword: (credentials: any) => {
        console.log('🔧 Mock: signInWithPassword called');
        return Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase not configured - please set up your environment variables' } 
        });
      },
      signUp: (credentials: any) => {
        console.log('🔧 Mock: signUp called');
        return Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: 'Supabase not configured - please set up your environment variables' } 
        });
      },
      signOut: () => {
        console.log('🔧 Mock: signOut called');
        return Promise.resolve({ error: null });
      },
      getSession: () => {
        console.log('🔧 Mock: getSession called');
        return Promise.resolve({ data: { session: null }, error: null });
      },
      onAuthStateChange: (callback: any) => {
        console.log('🔧 Mock: onAuthStateChange called');
        // Call the callback immediately with signed out state
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => {
                console.log('🔧 Mock: auth subscription unsubscribed');
              } 
            } 
          } 
        };
      }
    }
  };
};

export const supabase = (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') 
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
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

console.log((!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') 
  ? '⚠️ Supabase client initialized in mock mode' 
  : '✅ Supabase client initialized successfully');

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