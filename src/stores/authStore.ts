import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseReady } from '../lib/supabase';
import { User, AuthState } from '../types';
import type { AuthError, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    currentCountry: string;
    preferredLanguage: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
}

// Convert Supabase user + profile to our User type
const mapSupabaseUserToUser = (supabaseUser: SupabaseUser, profile: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  name: profile.name,
  currentCountry: profile.current_country,
  preferredLanguage: profile.preferred_language,
  avatarUrl: profile.avatar_url,
  membershipType: profile.membership_type,
  joinedDate: profile.joined_date
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        if (!isSupabaseReady) {
          return { success: false, error: 'Supabase is not configured. Please set up your environment variables.' };
        }

        set({ isLoading: true });
        
        try {
          console.log('🔐 Attempting login...');
          
          // Add timeout to prevent infinite loading
          const loginPromise = supabase.auth.signInWithPassword({
            email,
            password
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Login timeout - please try again')), 30000);
          });
          
          const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

          if (error) {
            console.log('🔐 Login error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            console.log('🔐 User authenticated, fetching profile...');
            // Fetch user profile
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            const profileTimeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Profile fetch timeout')), 15000);
            });
            
            const { data: profile, error: profileError } = await Promise.race([
              profilePromise, 
              profileTimeoutPromise
            ]);

            if (profileError) {
              console.log('🔐 Profile fetch error:', profileError.message);
              set({ isLoading: false });
              return { success: false, error: `Failed to load user profile: ${profileError.message}` };
            }

            const user = mapSupabaseUserToUser(data.user, profile);
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            console.log('🔐 Login successful');
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        } catch (error) {
          console.log('🔐 Login exception:', error);
          set({ isLoading: false });
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        if (!isSupabaseReady) {
          return { success: false, error: 'Supabase is not configured. Please set up your environment variables.' };
        }

        set({ isLoading: true });
        
        try {
          console.log('🔐 Attempting registration...');
          
          // Add timeout to prevent infinite loading
          const registerPromise = supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                name: userData.name,
                current_country: userData.currentCountry,
                preferred_language: userData.preferredLanguage
              }
            }
          });
          
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Registration timeout - please try again')), 30000);
          });
          
          const { data, error } = await Promise.race([registerPromise, timeoutPromise]);

          if (error) {
            console.log('🔐 Registration error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            console.log('🔐 User registered, waiting for profile creation...');
            // The profile will be created automatically by the trigger
            // Wait a moment for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('🔐 Fetching created profile...');
            // Fetch the created profile
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            const profileTimeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error('Profile creation timeout')), 15000);
            });
            
            const { data: profile, error: profileError } = await Promise.race([
              profilePromise, 
              profileTimeoutPromise
            ]);

            if (profile) {
              const user = mapSupabaseUserToUser(data.user, profile);
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
              console.log('🔐 Registration successful with profile');
            } else {
              console.log('🔐 Registration successful but profile not found:', profileError?.message);
              set({ isLoading: false });
              // Still return success since the user was created
              return { success: true };
            }
            
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Registration failed' };
        } catch (error) {
          console.log('🔐 Registration exception:', error);
          set({ isLoading: false });
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        console.log('🔐 Starting logout process...');
        
        // Set loading state during logout
        set({ isLoading: true });
        
        try {
          // Clear the state immediately to prevent UI issues
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false
          });
          
          // Clear localStorage immediately
          localStorage.removeItem('auth-storage');
          
          // Try to sign out from Supabase if configured
          if (isSupabaseReady) {
            console.log('🔐 Signing out from Supabase...');
            
            // Add timeout for logout
            const logoutPromise = supabase.auth.signOut();
            const timeoutPromise = new Promise((resolve) => {
              setTimeout(() => resolve({ error: null }), 5000);
            });
            
            const { error } = await Promise.race([logoutPromise, timeoutPromise]);
            
            if (error) {
              console.log('🔐 Supabase logout error (non-critical):', error.message);
            } else {
              console.log('🔐 Supabase logout successful');
            }
          }
          
          console.log('🔐 Logout completed');
          
          // Small delay before reload to ensure state is cleared
          setTimeout(() => {
            window.location.reload();
          }, 100);
          
        } catch (error) {
          console.log('🔐 Logout error:', error);
          
          // Even if there's an error, ensure we clear the local state
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false
          });
          localStorage.removeItem('auth-storage');
          
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      },

      updateProfile: async (userData) => {
        if (!isSupabaseReady) {
          return { success: false, error: 'Supabase is not configured' };
        }

        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        try {
          console.log('🔐 Updating profile...');
          
          // Add timeout for profile update
          const updatePromise = supabase
            .from('profiles')
            .update({
              name: userData.name,
              current_country: userData.currentCountry,
              preferred_language: userData.preferredLanguage,
              avatar_url: userData.avatarUrl,
              membership_type: userData.membershipType
            })
            .eq('id', user.id);
            
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile update timeout')), 15000);
          });
          
          const { error } = await Promise.race([updatePromise, timeoutPromise]);

          if (error) {
            console.log('🔐 Profile update error:', error.message);
            return { success: false, error: error.message };
          }

          // Update local state
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          
          console.log('🔐 Profile updated successfully');
          return { success: true };
        } catch (error) {
          console.log('🔐 Profile update exception:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
          return { success: false, error: errorMessage };
        }
      },

      checkAuth: async () => {
        if (!isSupabaseReady) {
          console.log('🔐 Supabase not configured - skipping auth check');
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          console.log('🔐 Checking authentication status...');
          
          // Add timeout for auth check
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve({ data: { session: null } }), 10000);
          });
          
          const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
          
          if (session?.user) {
            console.log('🔐 Found active session');
            
            const profilePromise = supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            const profileTimeoutPromise = new Promise((resolve) => {
              setTimeout(() => resolve({ data: null }), 10000);
            });
            
            const { data: profile } = await Promise.race([profilePromise, profileTimeoutPromise]);

            if (profile) {
              const user = mapSupabaseUserToUser(session.user, profile);
              set({ user, isAuthenticated: true });
              console.log('🔐 Auth check successful');
            } else {
              console.log('🔐 Profile not found');
              set({ user: null, isAuthenticated: false });
            }
          } else {
            console.log('🔐 No active session found');
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.log('🔐 Auth check failed:', error);
          set({ user: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Listen for auth changes only if Supabase is configured
if (isSupabaseReady) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔐 Auth state change:', event);
    const { checkAuth } = useAuthStore.getState();
    
    if (event === 'SIGNED_OUT') {
      // Clear state when signed out
      useAuthStore.setState({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false
      });
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      await checkAuth();
    }
  });
}