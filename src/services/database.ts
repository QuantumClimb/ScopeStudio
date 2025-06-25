import Database from 'better-sqlite3';
import path from 'path';
import { SiteData, UserData } from '../types';

// Initialize SQLite database
const dbPath = path.join(process.cwd(), 'scopestudio.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
const initializeDatabase = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Site data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users (email),
      UNIQUE(user_email)
    )
  `);

  console.log('✅ Database initialized successfully');
};

// Database operations
export const DatabaseService = {
  // Initialize the database
  init: initializeDatabase,

  // User operations
  createUser: (userData: UserData) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (email, plan) 
      VALUES (?, ?)
    `);
    
    try {
      const result = stmt.run(userData.email, userData.plan);
      console.log('✅ User created/updated:', userData.email);
      return result;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  getUser: (email: string): UserData | null => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    
    try {
      const user = stmt.get(email) as any;
      if (user) {
        return {
          email: user.email,
          plan: user.plan,
          isAuthenticated: true
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      return null;
    }
  },

  // Site data operations
  saveSiteData: (userEmail: string, siteData: SiteData) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO site_data (user_email, data, updated_at) 
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);
    
    try {
      const dataJson = JSON.stringify(siteData);
      const result = stmt.run(userEmail, dataJson);
      console.log('✅ Site data saved for user:', userEmail);
      return result;
    } catch (error) {
      console.error('❌ Error saving site data:', error);
      throw error;
    }
  },

  getSiteData: (userEmail: string): SiteData | null => {
    const stmt = db.prepare('SELECT data FROM site_data WHERE user_email = ?');
    
    try {
      const result = stmt.get(userEmail) as any;
      if (result && result.data) {
        return JSON.parse(result.data) as SiteData;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting site data:', error);
      return null;
    }
  },

  // Check if user has existing site data
  hasSiteData: (userEmail: string): boolean => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM site_data WHERE user_email = ?');
    
    try {
      const result = stmt.get(userEmail) as any;
      return result.count > 0;
    } catch (error) {
      console.error('❌ Error checking site data:', error);
      return false;
    }
  },

  // Get all users (for admin purposes)
  getAllUsers: () => {
    const stmt = db.prepare('SELECT email, plan, created_at FROM users ORDER BY created_at DESC');
    
    try {
      return stmt.all();
    } catch (error) {
      console.error('❌ Error getting all users:', error);
      return [];
    }
  },

  // Close database connection
  close: () => {
    db.close();
    console.log('📴 Database connection closed');
  }
};

// Initialize database on import
try {
  initializeDatabase();
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
} 