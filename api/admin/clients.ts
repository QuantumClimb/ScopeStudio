import { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get all user emails
    const userList = (await kv.get('admin:users') as string[]) || [];
    
    // Get site data for each user
    const clientSites = {};
    
    for (const email of userList) {
      const siteData = await kv.get(`site:${email}`);
      if (siteData) {
        clientSites[email] = siteData;
      }
    }
    
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