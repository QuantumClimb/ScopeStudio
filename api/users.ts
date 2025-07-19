import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SupabaseService } from '../../src/services/supabase';
import type { UserData } from '../../src/types';

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
    if (req.method === 'POST') {
      // Create/update user
      const userData: UserData = req.body;
      const result = await SupabaseService.createUser(userData);
      res.status(200).json({ success: true, user: userData });
    } else if (req.method === 'GET') {
      // Get user by email
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'Email parameter required' });
      }
      
      const user = await SupabaseService.getUser(email);
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(404).json({ success: false, error: 'User not found' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 