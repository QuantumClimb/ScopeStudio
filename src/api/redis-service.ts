import { SiteData, UserData } from '../types';

// Redis implementation for production
// In development, falls back to localStorage

const isProduction = import.meta.env.PROD;

export class RedisDataService {
  // Simple key-value operations using Redis directly
  private static async redisGet(key: string): Promise<any> {
    if (!isProduction) {
      // Development fallback to localStorage
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    }

    // Production: Use fetch to call our Redis API
    try {
      const response = await fetch('/api/redis/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      
      if (!response.ok) {
        console.error('Redis GET failed:', response.statusText);
        return null;
      }
      
      const result = await response.json();
      return result.value;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  private static async redisSet(key: string, value: any): Promise<boolean> {
    if (!isProduction) {
      // Development fallback to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }

    // Production: Use fetch to call our Redis API
    try {
      const response = await fetch('/api/redis/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  // User operations
  static async saveUser(userData: UserData): Promise<boolean> {
    const key = `user:${userData.email}`;
    return await this.redisSet(key, userData);
  }

  static async getUser(email: string): Promise<UserData | null> {
    const key = `user:${email}`;
    return await this.redisGet(key);
  }

  // Site data operations
  static async saveSiteData(userEmail: string, siteData: SiteData): Promise<boolean> {
    const key = `site:${userEmail}`;
    const success = await this.redisSet(key, siteData);
    
    if (success) {
      // Also save to user list for admin purposes
      await this.addToUserList(userEmail);
      console.log('✅ Site data saved to Redis for:', userEmail);
    } else {
      console.error('❌ Failed to save site data to Redis for:', userEmail);
    }
    
    return success;
  }

  static async getSiteData(userEmail: string): Promise<SiteData | null> {
    const key = `site:${userEmail}`;
    const data = await this.redisGet(key);
    if (data) {
      console.log('✅ Successfully retrieved site data from Redis for:', userEmail);
    } else {
      console.log('📭 No site data found in Redis for:', userEmail);
    }
    return data;
  }

  static async hasSiteData(userEmail: string): Promise<boolean> {
    const siteData = await this.getSiteData(userEmail);
    return siteData !== null;
  }

  // Admin operations
  private static async addToUserList(userEmail: string): Promise<void> {
    try {
      const userList = await this.redisGet('admin:users') || [];
      if (!userList.includes(userEmail)) {
        userList.push(userEmail);
        await this.redisSet('admin:users', userList);
      }
    } catch (error) {
      console.error('Error updating user list:', error);
    }
  }

  static async getAllUsers(): Promise<string[]> {
    return await this.redisGet('admin:users') || [];
  }

  // Client-specific operations for your workflow
  static async getClientSites(): Promise<Record<string, SiteData>> {
    const userList = await this.getAllUsers();
    const sites: Record<string, SiteData> = {};
    
    for (const email of userList) {
      const siteData = await this.getSiteData(email);
      if (siteData) {
        sites[email] = siteData;
      }
    }
    
    return sites;
  }

  // Migration from localStorage to Redis
  static async migrateFromLocalStorage(): Promise<boolean> {
    if (isProduction) {
      console.warn('Migration should only run in development');
      return false;
    }

    try {
      console.log('🔄 Starting migration from localStorage to Redis...');
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('scope-user') || 'null');
      if (!userData) {
        console.log('❌ No user data found in localStorage');
        return false;
      }
      
      // Get site data from localStorage
      const siteData = JSON.parse(localStorage.getItem(`scope-site-${userData.email}`) || 'null');
      if (!siteData) {
        console.log('❌ No site data found in localStorage');
        return false;
      }
      
      // Save to Redis (will use localStorage in dev, Redis in prod)
      const userSaved = await this.saveUser(userData);
      const siteSaved = await this.saveSiteData(userData.email, siteData);
      
      if (userSaved && siteSaved) {
        console.log('✅ Migration completed successfully');
        return true;
      } else {
        console.log('❌ Migration failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Migration error:', error);
      return false;
    }
  }
} 