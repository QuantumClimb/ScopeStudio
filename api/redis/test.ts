import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check if Redis URL is available
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      return res.status(500).json({ 
        error: 'REDIS_URL environment variable not found',
        hasRedisUrl: false
      });
    }

    // Log the Redis URL format (without exposing credentials)
    const urlParts = redisUrl.includes('@') ? redisUrl.split('@') : ['', redisUrl];
    const hostPart = urlParts[1] || urlParts[0];
    
    console.log('Redis URL format check:', {
      hasCredentials: redisUrl.includes('@'),
      hasRedis: redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://'),
      hostPart: hostPart?.substring(0, 20) + '...' // First 20 chars of host
    });

    // Try to create and connect to Redis
    const client = createClient({
      url: redisUrl
    });
    
    console.log('Attempting Redis connection...');
    await client.connect();
    console.log('Redis connected successfully!');
    
    // Test a simple operation
    await client.set('test-key', 'test-value');
    const testValue = await client.get('test-key');
    await client.del('test-key');
    
    await client.disconnect();
    console.log('Redis test completed successfully!');
    
    return res.status(200).json({ 
      success: true,
      message: 'Redis connection successful',
      testValue,
      redisUrlFormat: {
        hasCredentials: redisUrl.includes('@'),
        protocol: redisUrl.split('://')[0]
      }
    });
    
  } catch (error) {
    console.error('Redis test error:', error);
    
    return res.status(500).json({ 
      error: 'Redis connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
} 