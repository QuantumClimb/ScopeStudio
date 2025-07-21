import { SupabaseClientService } from './supabase-client';
import { ExportService, ExportOptions } from './export-service';
import type { SiteData, UserData } from '../types';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export interface IntegrationConfig {
  type: 'github' | 'vercel' | 'netlify' | 'custom';
  config: Record<string, unknown>;
}

// Main API Service class
export class ApiService {
  private static instance: ApiService;
  private analyticsQueue: AnalyticsEvent[] = [];
  private isProcessingAnalytics = false;

  private constructor() {
    // Initialize analytics processing
    this.processAnalyticsQueue();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // User Management API
  async createUser(userData: UserData): Promise<ApiResponse<UserData>> {
    try {
      const result = await SupabaseClientService.createUser(userData);
      return { success: true, data: userData };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUser(email: string): Promise<ApiResponse<UserData>> {
    try {
      const user = await SupabaseClientService.getUser(email);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createOrGetUser(email: string, plan: 'free' | 'pro' = 'free'): Promise<ApiResponse<UserData>> {
    try {
      const user = await SupabaseClientService.createOrGetUser(email, plan);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Site Data API
  async saveSiteData(userEmail: string, siteData: SiteData): Promise<ApiResponse<boolean>> {
    try {
      const result = await SupabaseClientService.saveSiteData(userEmail, siteData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getSiteData(userEmail: string): Promise<ApiResponse<SiteData>> {
    try {
      const siteData = await SupabaseClientService.getSiteData(userEmail);
      return { success: true, data: siteData };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async hasSiteData(userEmail: string): Promise<ApiResponse<boolean>> {
    try {
      const hasData = await SupabaseClientService.hasSiteData(userEmail);
      return { success: true, data: hasData };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Export API
  async exportSite(siteData: SiteData, userData: UserData, options: ExportOptions = {}): Promise<ApiResponse<unknown>> {
    try {
      const result = await ExportService.exportSite(siteData, userData, options);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Analytics API
  async trackEvent(event: string, properties: Record<string, unknown> = {}, userId?: string): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId
    };

    this.analyticsQueue.push(analyticsEvent);
    
    // Process immediately if queue is small
    if (this.analyticsQueue.length <= 5) {
      this.processAnalyticsQueue();
    }
  }

  private async processAnalyticsQueue(): Promise<void> {
    if (this.isProcessingAnalytics || this.analyticsQueue.length === 0) {
      return;
    }

    this.isProcessingAnalytics = true;

    try {
      const events = [...this.analyticsQueue];
      this.analyticsQueue = [];

      // Send analytics events to Supabase (or external service)
      for (const event of events) {
        await this.sendAnalyticsEvent(event);
      }
    } catch (error) {
      console.error('Analytics processing error:', error);
      // Re-queue failed events
      this.analyticsQueue.unshift(...this.analyticsQueue);
    } finally {
      this.isProcessingAnalytics = false;
      
      // Schedule next processing if there are more events
      if (this.analyticsQueue.length > 0) {
        setTimeout(() => this.processAnalyticsQueue(), 1000);
      }
    }
  }

  private async sendAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
    // For now, we'll store analytics in Supabase
    // In production, you might want to send to a dedicated analytics service
    try {
      // This would be implemented with a proper analytics table in Supabase
      console.log('Analytics event:', event);
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Integration APIs
  async deployToVercel(siteData: SiteData, config: IntegrationConfig): Promise<ApiResponse<unknown>> {
    try {
      // This would integrate with Vercel's API
      const result = await this.callVercelAPI(siteData, config);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async deployToNetlify(siteData: SiteData, config: IntegrationConfig): Promise<ApiResponse<unknown>> {
    try {
      // This would integrate with Netlify's API
      const result = await this.callNetlifyAPI(siteData, config);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async connectGitHub(config: IntegrationConfig): Promise<ApiResponse<unknown>> {
    try {
      // This would integrate with GitHub's API
      const result = await this.callGitHubAPI(config);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Private helper methods for integrations
  private async callVercelAPI(siteData: SiteData, config: IntegrationConfig): Promise<unknown> {
    // Implementation for Vercel API integration
    throw new Error('Vercel integration not implemented yet');
  }

  private async callNetlifyAPI(siteData: SiteData, config: IntegrationConfig): Promise<unknown> {
    // Implementation for Netlify API integration
    throw new Error('Netlify integration not implemented yet');
  }

  private async callGitHubAPI(config: IntegrationConfig): Promise<unknown> {
    // Implementation for GitHub API integration
    throw new Error('GitHub integration not implemented yet');
  }

  // Health check API
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    try {
      const status = 'healthy';
      const timestamp = new Date().toISOString();
      return { success: true, data: { status, timestamp } };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Rate limiting and caching utilities
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Error handling utilities
  private handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance(); 