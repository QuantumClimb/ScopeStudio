import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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

  try {
    if (req.method === 'GET') {
      // Get all users (admin only)
      const { data, error } = await supabase
        .from('scopestudio_users')
        .select('email, plan, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting all users:', error);
        return res.status(500).json({ success: false, error: 'Failed to get users' });
      }

      res.status(200).json({ success: true, users: data || [] });
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 