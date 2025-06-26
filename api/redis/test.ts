import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from 'redis';

export async function handler(req: VercelRequest, res: VercelResponse) {
  let client;
  
  try {
    // Check if Redis URL is available
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
      return res.status(500).json({ 
        error: 'REDIS_URL environment variable not found',
        hasRedisUrl: false,
        allEnvVars: Object.keys(process.env).filter(key => key.includes('REDIS'))
      });
    }

    console.log('Starting Redis connection test...');
    console.log('Redis URL exists:', !!redisUrl);
    console.log('Redis URL protocol:', redisUrl.split('://')[0]);

    // Create Redis client with timeout configuration
    console.log('Creating Redis client...');
    client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 10000 // 10 seconds
      }
    });

    // Add error event listener
    client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    console.log('Attempting to connect to Redis...');
    
    // Use Promise.race to add our own timeout
    const connectionPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    console.log('Redis connected successfully!');
    
    // Test basic operations with timeout
    console.log('Testing Redis operations...');
    await client.set('test-key', 'test-value');
    const testValue = await client.get('test-key');
    await client.del('test-key');
    console.log('Redis operations completed successfully!');
    
    return res.status(200).json({ 
      success: true,
      message: 'Redis connection and operations successful',
      testValue,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Redis test failed:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'UnknownError',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined
    };
    
    return res.status(500).json({ 
      error: 'Redis connection failed',
      details: errorDetails,
      hasRedisUrl: !!process.env.REDIS_URL,
      timestamp: new Date().toISOString()
    });
    
  } finally {
    // Ensure client is disconnected
    if (client) {
      try {
        console.log('Disconnecting Redis client...');
        await client.disconnect();
        console.log('Redis client disconnected successfully');
      } catch (disconnectError) {
        console.error('Error disconnecting Redis client:', disconnectError);
      }
    }
  }
}

// Default export for Vercel compatibility
export default handler; 