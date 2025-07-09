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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            console.log('🔐 Login error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.log('🔐 Profile fetch error:', profileError.message);
              set({ isLoading: false });
              return { success: false, error: 'Failed to load user profile' };
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
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      register: async (userData) => {
        if (!isSupabaseReady) {
          return { success: false, error: 'Supabase is not configured. Please set up your environment variables.' };
        }

        set({ isLoading: true });
        
        try {
          console.log('🔐 Attempting registration...');
          const { data, error } = await supabase.auth.signUp({
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

          if (error) {
            console.log('🔐 Registration error:', error.message);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }

          if (data.user) {
            // The profile will be created automatically by the trigger
            // Wait a moment for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Fetch the created profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profile) {
              const user = mapSupabaseUserToUser(data.user, profile);
              set({ 
                user, 
                isAuthenticated: true, 
                isLoading: false 
              });
            } else {
              set({ isLoading: false });
            }
            
            console.log('🔐 Registration successful');
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Registration failed' };
        } catch (error) {
          console.log('🔐 Registration exception:', error);
          set({ isLoading: false });
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        console.log('🔐 Starting logout process...');
        
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
            const { error } = await supabase.auth.signOut();
            
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
          const { error } = await supabase
            .from('profiles')
            .update({
              name: userData.name,
              current_country: userData.currentCountry,
              preferred_language: userData.preferredLanguage,
              avatar_url: userData.avatarUrl,
              membership_type: userData.membershipType
            })
            .eq('id', user.id);

          if (error) {
            return { success: false, error: error.message };
          }

          // Update local state
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Failed to update profile' };
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
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log('🔐 Found active session');
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

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