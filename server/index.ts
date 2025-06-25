import express from 'express';
import cors from 'cors';
import { DatabaseService } from '../src/services/database.js';
import type { SiteData, UserData } from '../src/types/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize database
DatabaseService.init();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ScopeStudio API is running' });
});

// User routes
app.post('/api/users', async (req, res) => {
  try {
    const userData: UserData = req.body;
    const result = DatabaseService.createUser(userData);
    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = DatabaseService.getUser(email);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
});

// Site data routes
app.post('/api/sites/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const siteData: SiteData = req.body;
    
    const result = DatabaseService.saveSiteData(email, siteData);
    res.json({ success: true, message: 'Site data saved successfully' });
  } catch (error) {
    console.error('Error saving site data:', error);
    res.status(500).json({ success: false, error: 'Failed to save site data' });
  }
});

app.get('/api/sites/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const siteData = DatabaseService.getSiteData(email);
    
    if (siteData) {
      res.json({ success: true, siteData });
    } else {
      res.json({ success: true, siteData: null });
    }
  } catch (error) {
    console.error('Error getting site data:', error);
    res.status(500).json({ success: false, error: 'Failed to get site data' });
  }
});

// Check if user has site data
app.get('/api/sites/:email/exists', async (req, res) => {
  try {
    const { email } = req.params;
    const hasData = DatabaseService.hasSiteData(email);
    res.json({ success: true, hasData });
  } catch (error) {
    console.error('Error checking site data:', error);
    res.status(500).json({ success: false, error: 'Failed to check site data' });
  }
});

// Admin routes
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = DatabaseService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ScopeStudio API server running on port ${PORT}`);
  console.log(`📊 Database: SQLite (scopestudio.db)`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  DatabaseService.close();
  process.exit(0);
}); 