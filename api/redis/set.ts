import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key, value } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    // Get Redis URL from environment
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return res.status(500).json({ error: 'Redis not configured' });
    }

    // Create Redis client
    const client = createClient({
      url: redisUrl
    });
    
    await client.connect();
    
    // Stringify the value if it's an object
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    await client.set(key, stringValue);
    
    await client.disconnect();
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Redis SET error:', error);
    return res.status(500).json({ error: 'Failed to set value in Redis' });
  }
} 