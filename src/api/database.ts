import { SiteData, UserData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Configuration to toggle between localStorage and API
const USE_DATABASE = false; // Set to true to use database API

export class DataService {
  // Check if API is available
  static async isAPIAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/../health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // User operations
  static async saveUser(userData: UserData): Promise<boolean> {
    if (!USE_DATABASE) {
      // localStorage implementation
      try {
        localStorage.setItem('scope-user', JSON.stringify(userData));
        return true;
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
        return false;
      }
    }

    // Database API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error saving user to database:', error);
      return false;
    }
  }

  static async getUser(email?: string): Promise<UserData | null> {
    if (!USE_DATABASE) {
      // localStorage implementation
      try {
        const savedUser = localStorage.getItem('scope-user');
        if (savedUser) {
          return JSON.parse(savedUser) as UserData;
        }
        return null;
      } catch (error) {
        console.error('Error getting user from localStorage:', error);
        return null;
      }
    }

    // Database API implementation
    if (!email) {
      console.error('Email required for database user lookup');
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.user : null;
    } catch (error) {
      console.error('Error getting user from database:', error);
      return null;
    }
  }

  // Site data operations
  static async saveSiteData(userEmail: string, siteData: SiteData): Promise<boolean> {
    if (!USE_DATABASE) {
      // localStorage implementation
      try {
        const jsonString = JSON.stringify(siteData, null, 2);
        localStorage.setItem(`scope-site-${userEmail}`, jsonString);
        console.log('✅ Site data saved to localStorage for:', userEmail);
        return true;
      } catch (error) {
        console.error('Error saving site data to localStorage:', error);
        return false;
      }
    }

    // Database API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${encodeURIComponent(userEmail)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Site data saved to database for:', userEmail);
        return true;
      } else {
        console.error('Database save failed:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving site data to database:', error);
      return false;
    }
  }

  static async getSiteData(userEmail: string): Promise<SiteData | null> {
    if (!USE_DATABASE) {
      // localStorage implementation
      try {
        const savedData = localStorage.getItem(`scope-site-${userEmail}`);
        if (savedData) {
          return JSON.parse(savedData) as SiteData;
        }
        return null;
      } catch (error) {
        console.error('Error getting site data from localStorage:', error);
        return null;
      }
    }

    // Database API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${encodeURIComponent(userEmail)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.siteData : null;
    } catch (error) {
      console.error('Error getting site data from database:', error);
      return null;
    }
  }

  static async hasSiteData(userEmail: string): Promise<boolean> {
    if (!USE_DATABASE) {
      // localStorage implementation
      try {
        const savedData = localStorage.getItem(`scope-site-${userEmail}`);
        return savedData !== null;
      } catch (error) {
        console.error('Error checking site data in localStorage:', error);
        return false;
      }
    }

    // Database API implementation
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${encodeURIComponent(userEmail)}/exists`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success ? result.hasData : false;
    } catch (error) {
      console.error('Error checking site data in database:', error);
      return false;
    }
  }

  // Migration helper - move data from localStorage to database
  static async migrateToDatabase(): Promise<boolean> {
    try {
      console.log('🔄 Starting migration from localStorage to database...');
      
      // Get user data from localStorage
      const userData = await this.getUser();
      if (!userData) {
        console.log('❌ No user data found in localStorage');
        return false;
      }
      
      // Get site data from localStorage
      const siteData = await this.getSiteData(userData.email);
      if (!siteData) {
        console.log('❌ No site data found in localStorage');
        return false;
      }
      
      // Switch to database mode temporarily
      const originalMode = USE_DATABASE;
      (DataService as any).USE_DATABASE = true;
      
      // Save to database
      const userSaved = await this.saveUser(userData);
      const siteSaved = await this.saveSiteData(userData.email, siteData);
      
      // Restore original mode
      (DataService as any).USE_DATABASE = originalMode;
      
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