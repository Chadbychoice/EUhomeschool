/*
  # Create and populate forum categories

  1. New Tables
    - Ensures forum_categories table exists with proper structure
    - Populates with all EU countries and general categories
  
  2. Security
    - Maintains RLS policies
    - Ensures proper permissions for authenticated users
*/

-- Create forum categories table if it doesn't exist
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

-- Enable RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for reading categories
DROP POLICY IF EXISTS "Anyone can read categories" ON forum_categories;
CREATE POLICY "Anyone can read categories"
  ON forum_categories
  FOR SELECT
  TO authenticated
  USING (true);

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
  ('Digital Nomad Families', 'digital-nomads', 'For families combining remote work with homeschooling while traveling', NULL)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_forum_categories_updated_at ON forum_categories;
CREATE TRIGGER update_forum_categories_updated_at
    BEFORE UPDATE ON forum_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();