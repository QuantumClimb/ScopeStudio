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

  createOrGetUser: async (email: string, plan: 'free' | 'pro' = 'free') => {
    console.log('🔍 [DEBUG] SupabaseClientService.createOrGetUser called with:', { email, plan });
    
    try {
      // First try to get existing user
      console.log('🔍 [DEBUG] Checking if user exists:', email);
      const existingUser = await SupabaseClientService.getUser(email);
      
      if (existingUser) {
        console.log('✅ [DEBUG] User already exists:', existingUser);
        return existingUser;
      }
      
      // If user doesn't exist, create new user
      console.log('🔍 [DEBUG] User does not exist, creating new user');
      await SupabaseClientService.createUser({ email, plan, isAuthenticated: true });
      
      // After creating, get the user to return
      const createdUser = await SupabaseClientService.getUser(email);
      if (createdUser) {
        console.log('✅ [DEBUG] New user created and retrieved:', createdUser);
        return createdUser;
      } else {
        console.error('❌ [DEBUG] Failed to create new user');
        return null;
      }
    } catch (error) {
      console.error('❌ [DEBUG] Exception in createOrGetUser:', error);
      return null;
    }
  },

  // Site data operations
  saveSiteData: async (userEmail: string, siteData: SiteData) => {
    console.log('🔍 [DEBUG] SupabaseClientService.saveSiteData called with:', {
      userEmail,
      siteDataPages: siteData.pages?.map(p => ({ id: p.id, name: p.name, title: p.title })) || [],
      siteDataKeys: Object.keys(siteData)
    });
    
    try {
      console.log('💾 [DEBUG] Calling Supabase upsert with data:', {
        user_email: userEmail,
        data: siteData
      });
      
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .upsert({
          user_email: userEmail,
          data: siteData
        }, {
          onConflict: 'user_email'
        });

      console.log('🔍 [DEBUG] Supabase upsert response:', { 
        data, 
        error, 
        hasData: !!data, 
        dataType: typeof data,
        errorCode: error?.code,
        errorMessage: error?.message 
      });

      if (error) {
        console.error('❌ [DEBUG] Supabase error saving site data:', error);
        throw error;
      }

      console.log('✅ [DEBUG] Site data saved successfully for user:', userEmail, {
        returnedData: data,
        dataIsNull: data === null,
        dataIsUndefined: data === undefined
      });
      // Return true on success, even if data is null (which is normal for upsert)
      return true;
    } catch (error) {
      console.error('❌ [DEBUG] Exception in saveSiteData:', error);
      throw error;
    }
  },

  getSiteData: async (userEmail: string): Promise<SiteData | null> => {
    console.log('🔍 [DEBUG] SupabaseClientService.getSiteData called for user:', userEmail);
    
    try {
      console.log('🔍 [DEBUG] Calling Supabase select query');
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .select('data')
        .eq('user_email', userEmail)
        .single();

      console.log('🔍 [DEBUG] Supabase select response:', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📭 [DEBUG] No rows returned (PGRST116)');
          return null;
        }
        console.error('❌ [DEBUG] Supabase error getting site data:', error);
        return null;
      }

      if (data && data.data) {
        console.log('✅ [DEBUG] Found site data:', {
          hasData: !!data.data,
          dataKeys: Object.keys(data.data),
          pagesCount: data.data.pages?.length || 0
        });
        return data.data as SiteData;
      }
      
      console.log('📭 [DEBUG] No data found in response');
      return null;
    } catch (error) {
      console.error('❌ [DEBUG] Exception in getSiteData:', error);
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