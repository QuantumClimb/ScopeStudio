import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import type { SiteData } from '../../src/types';

// Supabase configuration
const supabaseUrl = 'https://fihfnzxcsmzhprwakhhr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaGZuenhjc216aHByd2FraGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDAzNzUsImV4cCI6MjA2NjAxNjM3NX0.o5A3zpe_86t5bfNgrdp60LxkpLLRp9oOcr997OlUZwo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Email parameter required' });
  }

  try {
    if (req.method === 'POST') {
      // Save site data
      const siteData: SiteData = req.body;
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .upsert({
          user_email: email,
          data: siteData
        }, {
          onConflict: 'user_email'
        });

      if (error) {
        console.error('Error saving site data:', error);
        return res.status(500).json({ success: false, error: 'Failed to save site data' });
      }

      res.status(200).json({ success: true, message: 'Site data saved successfully' });
    } else if (req.method === 'GET') {
      // Get site data
      const { data, error } = await supabase
        .from('scopestudio_site_data')
        .select('data')
        .eq('user_email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return res.status(200).json({ success: true, siteData: null });
        }
        console.error('Error getting site data:', error);
        return res.status(500).json({ success: false, error: 'Failed to get site data' });
      }

      if (data && data.data) {
        res.status(200).json({ success: true, siteData: data.data });
      } else {
        res.status(200).json({ success: true, siteData: null });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 