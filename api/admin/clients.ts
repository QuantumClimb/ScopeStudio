import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Create Redis client
    const client = createClient({ url: process.env.REDIS_URL });
    await client.connect();
    
    // Get all user emails
    const userListStr = await client.get('admin:users');
    const userList = userListStr ? JSON.parse(userListStr) : [];
    
    // Get site data for each user
    const clientSites = {};
    
    for (const email of userList) {
      const siteDataStr = await client.get(`site:${email}`);
      if (siteDataStr) {
        clientSites[email] = JSON.parse(siteDataStr);
      }
    }
    
    await client.disconnect();
    
    return res.json({ 
      success: true, 
      clients: clientSites,
      totalClients: userList.length 
    });
    
  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 