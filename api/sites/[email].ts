import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';
import { SiteData } from '../../src/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { email } = req.query;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, error: 'Email parameter required' });
  }

  try {
    // Create Redis client
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    
    if (req.method === 'GET') {
      // Get site data for user
      const siteDataStr = await client.get(`site:${email}`);
      const siteData = siteDataStr ? JSON.parse(siteDataStr) : null;
      
      await client.disconnect();
      return res.json({ success: true, siteData });
      
    } else if (req.method === 'POST') {
      // Save site data for user
      const siteData: SiteData = req.body;
      
      if (!siteData || !siteData.pages) {
        await client.disconnect();
        return res.status(400).json({ success: false, error: 'Invalid site data' });
      }
      
      await client.set(`site:${email}`, JSON.stringify(siteData));
      
      // Add to user list for admin purposes
      const userListStr = await client.get('admin:users');
      const userList = userListStr ? JSON.parse(userListStr) : [];
      if (!userList.includes(email)) {
        userList.push(email);
        await client.set('admin:users', JSON.stringify(userList));
      }
      
      await client.disconnect();
      return res.json({ success: true, message: 'Site data saved successfully' });
      
    } else {
      await client.disconnect();
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 