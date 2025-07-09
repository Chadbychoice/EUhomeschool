import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
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
              set({ isLoading: false });
              return { success: false, error: 'Failed to load user profile' };
            }

            const user = mapSupabaseUserToUser(data.user, profile);
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Login failed' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      register: async (userData) => {
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
            
            return { success: true };
          }

          set({ isLoading: false });
          return { success: false, error: 'Registration failed' };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        try {
          console.log('🔐 Attempting logout...');
          // Sign out from Supabase
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            console.log('🔐 Logout error (non-critical):', error);
          }
          
          // Clear the state regardless of Supabase response
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false
          });
          
          // Clear localStorage
          localStorage.removeItem('auth-storage');
          
          // Force a page reload to ensure clean state
          window.location.reload();
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if there's an error
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false
          });
          localStorage.removeItem('auth-storage');
          window.location.reload();
        }
      },

      updateProfile: async (userData) => {
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
            }
          } else {
            console.log('🔐 No active session found');
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.log('🔐 Auth check failed (using mock mode):', error);
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

// Listen for auth changes
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
  } else {
    await checkAuth();
  }
});