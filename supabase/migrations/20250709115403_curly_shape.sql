/*
  # Fix Forum Database Setup

  1. Clean Setup
    - Drop and recreate all forum tables with proper structure
    - Ensure all foreign key relationships work correctly
    - Add proper indexes for performance

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for authenticated users
    - Ensure profiles table is accessible

  3. Data Population
    - Insert all EU countries as forum categories
    - Add sample data for testing

  4. Functions and Triggers
    - Update count functions
    - Proper trigger setup
*/

-- First, ensure profiles table exists and is accessible
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  current_country text NOT NULL,
  preferred_language text NOT NULL,
  avatar_url text,
  membership_type text DEFAULT 'free' CHECK (membership_type IN ('free', 'premium')),
  joined_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create comprehensive profile policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read basic profile info of others (for forum display)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Drop existing forum tables if they exist
DROP TABLE IF EXISTS forum_posts CASCADE;
DROP TABLE IF EXISTS forum_topics CASCADE;
DROP TABLE IF EXISTS forum_categories CASCADE;

-- Create forum_categories table
CREATE TABLE forum_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  country_code text,
  topic_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_topics table
CREATE TABLE forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  last_post_at timestamptz DEFAULT now(),
  last_post_author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum_posts table
CREATE TABLE forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all forum tables
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for forum_categories
CREATE POLICY "Anyone can read categories"
  ON forum_categories FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for forum_topics
CREATE POLICY "Anyone can read topics"
  ON forum_topics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create topics"
  ON forum_topics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own topics"
  ON forum_topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own topics"
  ON forum_topics FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create policies for forum_posts
CREATE POLICY "Anyone can read posts"
  ON forum_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX idx_forum_topics_author_id ON forum_topics(author_id);
CREATE INDEX idx_forum_topics_category_id ON forum_topics(category_id);
CREATE INDEX idx_forum_topics_created_at ON forum_topics(created_at DESC);
CREATE INDEX idx_forum_topics_last_post_at ON forum_topics(last_post_at DESC);
CREATE INDEX idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_topic_id ON forum_posts(topic_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or replace the forum counts update function
CREATE OR REPLACE FUNCTION update_forum_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update topic counts in categories
    IF TG_TABLE_NAME = 'forum_topics' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE forum_categories 
            SET topic_count = topic_count + 1 
            WHERE id = NEW.category_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE forum_categories 
            SET topic_count = topic_count - 1 
            WHERE id = OLD.category_id;
        END IF;
    END IF;
    
    -- Update post counts in topics and categories
    IF TG_TABLE_NAME = 'forum_posts' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE forum_topics 
            SET 
                post_count = post_count + 1,
                last_post_at = NEW.created_at,
                last_post_author_id = NEW.author_id
            WHERE id = NEW.topic_id;
            
            UPDATE forum_categories 
            SET post_count = post_count + 1 
            WHERE id = (SELECT category_id FROM forum_topics WHERE id = NEW.topic_id);
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE forum_topics 
            SET post_count = post_count - 1 
            WHERE id = OLD.topic_id;
            
            UPDATE forum_categories 
            SET post_count = post_count - 1 
            WHERE id = (SELECT category_id FROM forum_topics WHERE id = OLD.topic_id);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_forum_categories_updated_at
    BEFORE UPDATE ON forum_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at
    BEFORE UPDATE ON forum_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for count updates
CREATE TRIGGER update_forum_topic_counts
    AFTER INSERT OR DELETE ON forum_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_forum_counts();

CREATE TRIGGER update_forum_post_counts
    AFTER INSERT OR DELETE ON forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_forum_counts();

-- Insert all EU countries as forum categories
INSERT INTO forum_categories (name, slug, description, country_code) VALUES
  ('Austria', 'austria', 'Discussions about homeschooling in Austria', 'AT'),
  ('Belgium', 'belgium', 'Discussions about homeschooling in Belgium', 'BE'),
  ('Bulgaria', 'bulgaria', 'Discussions about homeschooling in Bulgaria', 'BG'),
  ('Croatia', 'croatia', 'Discussions about homeschooling in Croatia', 'HR'),
  ('Cyprus', 'cyprus', 'Discussions about homeschooling in Cyprus', 'CY'),
  ('Czech Republic', 'czech-republic', 'Discussions about homeschooling in Czech Republic', 'CZ'),
  ('Denmark', 'denmark', 'Discussions about homeschooling in Denmark', 'DK'),
  ('Estonia', 'estonia', 'Discussions about homeschooling in Estonia', 'EE'),
  ('Finland', 'finland', 'Discussions about homeschooling in Finland', 'FI'),
  ('France', 'france', 'Discussions about homeschooling in France', 'FR'),
  ('Germany', 'germany', 'Discussions about homeschooling in Germany', 'DE'),
  ('Greece', 'greece', 'Discussions about homeschooling in Greece', 'GR'),
  ('Hungary', 'hungary', 'Discussions about homeschooling in Hungary', 'HU'),
  ('Ireland', 'ireland', 'Discussions about homeschooling in Ireland', 'IE'),
  ('Italy', 'italy', 'Discussions about homeschooling in Italy', 'IT'),
  ('Latvia', 'latvia', 'Discussions about homeschooling in Latvia', 'LV'),
  ('Lithuania', 'lithuania', 'Discussions about homeschooling in Lithuania', 'LT'),
  ('Luxembourg', 'luxembourg', 'Discussions about homeschooling in Luxembourg', 'LU'),
  ('Malta', 'malta', 'Discussions about homeschooling in Malta', 'MT'),
  ('Netherlands', 'netherlands', 'Discussions about homeschooling in Netherlands', 'NL'),
  ('Poland', 'poland', 'Discussions about homeschooling in Poland', 'PL'),
  ('Portugal', 'portugal', 'Discussions about homeschooling in Portugal', 'PT'),
  ('Romania', 'romania', 'Discussions about homeschooling in Romania', 'RO'),
  ('Slovakia', 'slovakia', 'Discussions about homeschooling in Slovakia', 'SK'),
  ('Slovenia', 'slovenia', 'Discussions about homeschooling in Slovenia', 'SI'),
  ('Spain', 'spain', 'Discussions about homeschooling in Spain', 'ES'),
  ('Sweden', 'sweden', 'Discussions about homeschooling in Sweden', 'SE'),
  ('General Discussion', 'general', 'General homeschooling discussions not specific to any country', NULL),
  ('Resources & Curriculum', 'resources', 'Share and discuss homeschooling resources and curriculum', NULL),
  ('Legal & Regulations', 'legal', 'Discussions about homeschooling laws and regulations across the EU', NULL),
  ('Digital Nomad Families', 'digital-nomads', 'For families combining remote work with homeschooling while traveling', NULL);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, current_country, preferred_language)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'current_country', ''),
    COALESCE(new.raw_user_meta_data->>'preferred_language', 'English')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();