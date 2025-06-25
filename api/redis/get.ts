import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.body;
    
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
    
    const value = await client.get(key);
    
    await client.disconnect();
    
    // Parse JSON if it's a valid JSON string
    let parsedValue = value;
    if (value) {
      try {
        parsedValue = JSON.parse(value);
      } catch {
        // Keep as string if not valid JSON
      }
    }
    
    return res.status(200).json({ value: parsedValue });
    
  } catch (error) {
    console.error('Redis GET error:', error);
    return res.status(500).json({ error: 'Failed to get value from Redis' });
  }
} 