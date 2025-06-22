/*
  # Forum Organization Update

  1. New Tables
    - `forum_categories` - Categories for organizing discussions (by country)
    - `forum_topics` - Discussion topics within categories
    - `forum_posts` - Individual posts within topics
    
  2. Changes to Existing Tables
    - Update posts table to be forum_posts with topic relationship
    - Add proper indexing for performance
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    
  4. Data Organization
    - Topics must be assigned to a country category
    - Posts belong to topics
    - Proper hierarchical structure
*/

-- Drop existing posts table and recreate with better structure
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- Create forum categories (countries)
CREATE TABLE IF NOT EXISTS forum_categories (
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

-- Create forum topics
CREATE TABLE IF NOT EXISTS forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES forum_categories(id) ON DELETE CASCADE NOT NULL,
  is_pinned boolean DEFAULT false,
  is_locked boolean DEFAULT false,
  view_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  last_post_at timestamptz DEFAULT now(),
  last_post_author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum posts (replies to topics)
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES forum_topics(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

-- Forum categories policies
CREATE POLICY "Anyone can read categories"
  ON forum_categories
  FOR SELECT
  TO authenticated
  USING (true);

-- Forum topics policies
CREATE POLICY "Anyone can read topics"
  ON forum_topics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create topics"
  ON forum_topics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own topics"
  ON forum_topics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own topics"
  ON forum_topics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Forum posts policies
CREATE POLICY "Anyone can read posts"
  ON forum_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON forum_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add updated_at triggers
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

-- Create indexes for performance
CREATE INDEX idx_forum_topics_category_id ON forum_topics(category_id);
CREATE INDEX idx_forum_topics_author_id ON forum_topics(author_id);
CREATE INDEX idx_forum_topics_created_at ON forum_topics(created_at DESC);
CREATE INDEX idx_forum_posts_topic_id ON forum_posts(topic_id);
CREATE INDEX idx_forum_posts_author_id ON forum_posts(author_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);

-- Insert default categories for EU countries
INSERT INTO forum_categories (name, slug, description, country_code) VALUES
  ('General Discussion', 'general', 'General homeschooling discussions not specific to any country', NULL),
  ('Portugal', 'portugal', 'Homeschooling discussions for Portugal', 'PT'),
  ('Ireland', 'ireland', 'Homeschooling discussions for Ireland', 'IE'),
  ('Spain', 'spain', 'Homeschooling discussions for Spain', 'ES'),
  ('France', 'france', 'Homeschooling discussions for France', 'FR'),
  ('Germany', 'germany', 'Homeschooling discussions for Germany', 'DE'),
  ('Netherlands', 'netherlands', 'Homeschooling discussions for Netherlands', 'NL'),
  ('Italy', 'italy', 'Homeschooling discussions for Italy', 'IT'),
  ('Austria', 'austria', 'Homeschooling discussions for Austria', 'AT'),
  ('Belgium', 'belgium', 'Homeschooling discussions for Belgium', 'BE'),
  ('Denmark', 'denmark', 'Homeschooling discussions for Denmark', 'DK'),
  ('Finland', 'finland', 'Homeschooling discussions for Finland', 'FI'),
  ('Sweden', 'sweden', 'Homeschooling discussions for Sweden', 'SE'),
  ('Norway', 'norway', 'Homeschooling discussions for Norway', 'NO'),
  ('Czech Republic', 'czech-republic', 'Homeschooling discussions for Czech Republic', 'CZ'),
  ('Poland', 'poland', 'Homeschooling discussions for Poland', 'PL'),
  ('Hungary', 'hungary', 'Homeschooling discussions for Hungary', 'HU'),
  ('Croatia', 'croatia', 'Homeschooling discussions for Croatia', 'HR'),
  ('Slovenia', 'slovenia', 'Homeschooling discussions for Slovenia', 'SI'),
  ('Slovakia', 'slovakia', 'Homeschooling discussions for Slovakia', 'SK'),
  ('Estonia', 'estonia', 'Homeschooling discussions for Estonia', 'EE'),
  ('Latvia', 'latvia', 'Homeschooling discussions for Latvia', 'LV'),
  ('Lithuania', 'lithuania', 'Homeschooling discussions for Lithuania', 'LT'),
  ('Romania', 'romania', 'Homeschooling discussions for Romania', 'RO'),
  ('Bulgaria', 'bulgaria', 'Homeschooling discussions for Bulgaria', 'BG'),
  ('Greece', 'greece', 'Homeschooling discussions for Greece', 'GR'),
  ('Cyprus', 'cyprus', 'Homeschooling discussions for Cyprus', 'CY'),
  ('Malta', 'malta', 'Homeschooling discussions for Malta', 'MT'),
  ('Luxembourg', 'luxembourg', 'Homeschooling discussions for Luxembourg', 'LU')
ON CONFLICT (slug) DO NOTHING;

-- Function to update topic and category counts
CREATE OR REPLACE FUNCTION update_forum_counts()
RETURNS trigger AS $$
BEGIN
  -- Update topic post count
  IF TG_TABLE_NAME = 'forum_posts' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE forum_topics 
      SET post_count = post_count + 1,
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
  
  -- Update category topic count
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
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for count updates
CREATE TRIGGER update_forum_post_counts
  AFTER INSERT OR DELETE ON forum_posts
  FOR EACH ROW EXECUTE FUNCTION update_forum_counts();

CREATE TRIGGER update_forum_topic_counts
  AFTER INSERT OR DELETE ON forum_topics
  FOR EACH ROW EXECUTE FUNCTION update_forum_counts();