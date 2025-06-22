import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ConnectionDebugger: React.FC = () => {
  const [tests, setTests] = useState({
    envVars: { status: 'pending', message: '' },
    connection: { status: 'pending', message: '' },
    auth: { status: 'pending', message: '' },
    database: { status: 'pending', message: '' }
  });

  const runTests = async () => {
    // Reset all tests
    setTests({
      envVars: { status: 'pending', message: '' },
      connection: { status: 'pending', message: '' },
      auth: { status: 'pending', message: '' },
      database: { status: 'pending', message: '' }
    });

    // Test 1: Environment Variables
    console.log('🔍 Testing environment variables...');
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setTests(prev => ({
        ...prev,
        envVars: { 
          status: 'error', 
          message: `Missing: ${!supabaseUrl ? 'VITE_SUPABASE_URL' : ''} ${!supabaseKey ? 'VITE_SUPABASE_ANON_KEY' : ''}` 
        }
      }));
      return;
    } else {
      setTests(prev => ({
        ...prev,
        envVars: { 
          status: 'success', 
          message: `URL: ${supabaseUrl.substring(0, 30)}... | Key: ${supabaseKey.substring(0, 20)}...` 
        }
      }));
    }

    // Test 2: Basic Connection
    console.log('🔍 Testing basic connection...');
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.error('❌ Connection error:', error);
        setTests(prev => ({
          ...prev,
          connection: { 
            status: 'error', 
            message: `Connection failed: ${error.message}` 
          }
        }));
        return;
      } else {
        console.log('✅ Connection successful');
        setTests(prev => ({
          ...prev,
          connection: { 
            status: 'success', 
            message: 'Basic connection successful' 
          }
        }));
      }
    } catch (err: any) {
      console.error('❌ Connection error:', err);
      setTests(prev => ({
        ...prev,
        connection: { 
          status: 'error', 
          message: `Connection error: ${err.message || 'Unknown error'}` 
        }
      }));
      return;
    }

    // Test 3: Auth Status
    console.log('🔍 Testing auth status...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      setTests(prev => ({
        ...prev,
        auth: { 
          status: session ? 'success' : 'warning', 
          message: session ? `Authenticated as: ${session.user.email}` : 'Not authenticated (this is normal)' 
        }
      }));
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setTests(prev => ({
        ...prev,
        auth: { 
          status: 'error', 
          message: `Auth error: ${err.message || 'Unknown error'}` 
        }
      }));
    }

    // Test 4: Database Tables
    console.log('🔍 Testing database tables...');
    try {
      const { data: categories, error: catError } = await supabase
        .from('forum_categories')
        .select('count')
        .limit(1);

      if (catError) {
        console.error('❌ Database error:', catError);
        setTests(prev => ({
          ...prev,
          database: { 
            status: 'error', 
            message: `Database error: ${catError.message}` 
          }
        }));
      } else {
        console.log('✅ Database access successful');
        setTests(prev => ({
          ...prev,
          database: { 
            status: 'success', 
            message: 'Forum tables accessible' 
          }
        }));
      }
    } catch (err: any) {
      console.error('❌ Database test failed:', err);
      setTests(prev => ({
        ...prev,
        database: { 
          status: 'error', 
          message: `Database test failed: ${err.message || 'Unknown error'}` 
        }
      }));
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <RefreshCw className="text-gray-500 animate-spin" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          🔧 Supabase Connection Debugger
        </h2>
        <button
          onClick={runTests}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Retest</span>
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(tests).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <h3 className="font-semibold capitalize">
                  {testName.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm mt-1">{result.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          💡 Troubleshooting Tips:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Make sure you have a <code>.env</code> file in your project root</li>
          <li>• Check that your Supabase URL and anon key are correct</li>
          <li>• Verify your Supabase project is active and not paused</li>
          <li>• Ensure RLS policies allow authenticated users to read data</li>
          <li>• Try refreshing the page if you just updated environment variables</li>
          <li>• Check your internet connection and firewall settings</li>
          <li>• Verify your Supabase project region is accessible from your location</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
        <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">
          🔍 Debug Information:
        </h4>
        <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
          <div>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
          <div>Environment: {import.meta.env.MODE}</div>
          <div>Timestamp: {new Date().toISOString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionDebugger;