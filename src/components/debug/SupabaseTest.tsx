import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Database, Users, MessageSquare } from 'lucide-react';

const SupabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: { status: 'pending' | 'success' | 'error'; message: string }}>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<{ success: boolean; message: string }>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'pending', message: 'Running...' }
    }));

    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: result.success ? 'success' : 'error', 
          message: result.message 
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'error', 
          message: error instanceof Error ? error.message : 'Unknown error' 
        }
      }));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    // Test 1: Basic Connection
    await runTest('connection', async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (error) {
          return { success: false, message: `Connection failed: ${error.message}` };
        }
        
        return { success: true, message: 'Successfully connected to Supabase' };
      } catch (err) {
        return { success: false, message: `Connection error: ${err}` };
      }
    });

    // Test 2: Auth Status
    await runTest('auth', async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          return { success: false, message: `Auth error: ${error.message}` };
        }
        
        if (session) {
          return { success: true, message: `Authenticated as: ${session.user.email}` };
        } else {
          return { success: true, message: 'Not authenticated (this is normal for testing)' };
        }
      } catch (err) {
        return { success: false, message: `Auth test failed: ${err}` };
      }
    });

    // Test 3: Forum Categories
    await runTest('categories', async () => {
      try {
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .limit(5);
        
        if (error) {
          return { success: false, message: `Categories query failed: ${error.message}` };
        }
        
        return { success: true, message: `Found ${data?.length || 0} forum categories` };
      } catch (err) {
        return { success: false, message: `Categories test failed: ${err}` };
      }
    });

    // Test 4: Forum Topics
    await runTest('topics', async () => {
      try {
        const { data, error } = await supabase
          .from('forum_topics')
          .select(`
            *,
            author:profiles!forum_topics_author_id_fkey(name, avatar_url),
            category:forum_categories!forum_topics_category_id_fkey(name, slug)
          `)
          .limit(5);
        
        if (error) {
          return { success: false, message: `Topics query failed: ${error.message}` };
        }
        
        return { success: true, message: `Found ${data?.length || 0} forum topics` };
      } catch (err) {
        return { success: false, message: `Topics test failed: ${err}` };
      }
    });

    // Test 5: Forum Posts
    await runTest('posts', async () => {
      try {
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:profiles!forum_posts_author_id_fkey(name, avatar_url)
          `)
          .limit(5);
        
        if (error) {
          return { success: false, message: `Posts query failed: ${error.message}` };
        }
        
        return { success: true, message: `Found ${data?.length || 0} forum posts` };
      } catch (err) {
        return { success: false, message: `Posts test failed: ${err}` };
      }
    });

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'pending':
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'pending':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const testConfig = [
    { key: 'connection', name: 'Database Connection', icon: Database },
    { key: 'auth', name: 'Authentication', icon: Users },
    { key: 'categories', name: 'Forum Categories', icon: MessageSquare },
    { key: 'topics', name: 'Forum Topics', icon: MessageSquare },
    { key: 'posts', name: 'Forum Posts', icon: MessageSquare },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          🧪 Supabase Database Tests
        </h2>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`btn-primary flex items-center space-x-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw size={16} className={isRunning ? 'animate-spin' : ''} />
          <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {testConfig.map(({ key, name, icon: Icon }) => {
          const result = testResults[key];
          const status = result?.status || 'idle';
          
          return (
            <div
              key={key}
              className={`p-4 border rounded-lg ${getStatusColor(status)}`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(status)}
                <Icon size={18} />
                <div className="flex-1">
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm mt-1">
                    {result?.message || 'Click "Run Tests" to check this component'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          📋 Test Information:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• <strong>Database Connection:</strong> Tests basic connectivity to Supabase</li>
          <li>• <strong>Authentication:</strong> Checks current auth session status</li>
          <li>• <strong>Forum Categories:</strong> Tests forum_categories table access</li>
          <li>• <strong>Forum Topics:</strong> Tests forum_topics table with joins</li>
          <li>• <strong>Forum Posts:</strong> Tests forum_posts table with joins</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">
          🔍 Environment Info:
        </h4>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set'}</div>
          <div>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
          <div>Environment: {import.meta.env.MODE}</div>
          <div>Test Time: {new Date().toISOString()}</div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;