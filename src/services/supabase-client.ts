import { createClient } from '@supabase/supabase-js';
import type { SiteData, UserData } from '../types';

// Supabase configuration
const supabaseUrl = 'https://fihfnzxcsmzhprwakhhr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaGZuenhjc216aHByd2FraGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDAzNzUsImV4cCI6MjA2NjAxNjM3NX0.o5A3zpe_86t5bfNgrdp60LxkpLLRp9oOcr997OlUZwo';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client-side database operations
export const SupabaseClientService = {
  // User operations
  createUser: async (userData: UserData) => {
    try {
      const { data, error } = await supabase
        .from('scopestudio_users')
        .upsert({
          email: userData.email,
          plan: userData.plan
        }, {
          onConflict: 'email'
        });

      if (error) {
        console.error('❌ Error creating user:', error);
        throw error;
      }

      console.log('✅ User created/updated:', userData.email);
      return data;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  getUser: async (email: string): Promise<UserData | null> => {
    try {
      const { data, error } = await supabase
        .from('scopestudio_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('❌ Error getting user:', error);
        return null;
      }

      if (data) {
        return {
          email: data.email,
          plan: data.plan,
          isAuthenticated: true
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },

  // Site data operations
  saveSiteData: async (userEmail: string, siteData: SiteData) => {
    try {
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .upsert({
          user_email: userEmail,
          data: siteData
        }, {
          onConflict: 'user_email'
        });

      if (error) {
        console.error('❌ Error saving site data:', error);
        throw error;
      }

      console.log('✅ Site data saved for user:', userEmail);
      return data;
    } catch (error) {
      console.error('❌ Error saving site data:', error);
      throw error;
    }
  },

  getSiteData: async (userEmail: string): Promise<SiteData | null> => {
    try {
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .select('data')
        .eq('user_email', userEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('❌ Error getting site data:', error);
        return null;
      }

      if (data && data.data) {
        return data.data as SiteData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting site data:', error);
      return null;
    }
  },

  // Check if user has existing site data
  hasSiteData: async (userEmail: string): Promise<boolean> => {
    try {
      const { count, error } = await supabase
        .from('scopestudio_site_data')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', userEmail);

      if (error) {
        console.error('❌ Error checking site data:', error);
        return false;
      }

      return (count || 0) > 0;
    } catch (error) {
      console.error('❌ Error checking site data:', error);
      return false;
    }
  }
}; 