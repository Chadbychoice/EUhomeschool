// Simple Node.js script to test Supabase connection
// Run with: node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Testing basic connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function testAuth() {
  try {
    console.log('\n🔐 Testing auth status...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth error:', error.message);
      return false;
    }
    
    if (session) {
      console.log('✅ Authenticated as:', session.user.email);
    } else {
      console.log('ℹ️ Not authenticated (this is normal)');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Auth test failed:', err.message);
    return false;
  }
}

async function testForumTables() {
  try {
    console.log('\n📋 Testing forum tables...');
    
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('forum_categories')
      .select('*')
      .limit(5);
    
    if (catError) {
      console.error('❌ Categories query failed:', catError.message);
      return false;
    }
    
    console.log(`✅ Found ${categories?.length || 0} forum categories`);
    
    // Test topics with joins
    const { data: topics, error: topicError } = await supabase
      .from('forum_topics')
      .select(`
        *,
        author:profiles!forum_topics_author_id_fkey(name, avatar_url),
        category:forum_categories!forum_topics_category_id_fkey(name, slug)
      `)
      .limit(5);
    
    if (topicError) {
      console.error('❌ Topics query failed:', topicError.message);
      return false;
    }
    
    console.log(`✅ Found ${topics?.length || 0} forum topics`);
    
    // Test posts with joins
    const { data: posts, error: postError } = await supabase
      .from('forum_posts')
      .select(`
        *,
        author:profiles!forum_posts_author_id_fkey(name, avatar_url)
      `)
      .limit(5);
    
    if (postError) {
      console.error('❌ Posts query failed:', postError.message);
      return false;
    }
    
    console.log(`✅ Found ${posts?.length || 0} forum posts`);
    
    return true;
  } catch (err) {
    console.error('❌ Forum tables test failed:', err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Supabase tests...\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('\n❌ Connection test failed. Check your Supabase configuration.');
    process.exit(1);
  }
  
  const authOk = await testAuth();
  if (!authOk) {
    console.log('\n❌ Auth test failed.');
    process.exit(1);
  }
  
  const forumOk = await testForumTables();
  if (!forumOk) {
    console.log('\n❌ Forum tables test failed. Run the migration first.');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed! Supabase is properly configured.');
}

runAllTests().catch(console.error);