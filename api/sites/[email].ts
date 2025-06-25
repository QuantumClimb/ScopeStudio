import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { SiteData } from '../../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { email } = req.query;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Email parameter required' });
  }

  try {
    if (req.method === 'GET') {
      // Get site data for user
      const siteData = await kv.get(`site:${email}`);
      return res.json({ success: true, siteData });
      
    } else if (req.method === 'POST') {
      // Save site data for user
      const siteData: SiteData = req.body;
      
      if (!siteData || !siteData.pages) {
        return res.status(400).json({ success: false, error: 'Invalid site data' });
      }
      
      await kv.set(`site:${email}`, siteData);
      
      // Add to user list for admin purposes
      const userList = (await kv.get('admin:users') as string[]) || [];
      if (!userList.includes(email)) {
        userList.push(email);
        await kv.set('admin:users', userList);
      }
      
      return res.json({ success: true, message: 'Site data saved successfully' });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 