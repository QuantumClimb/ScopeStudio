import { apiService } from './api-service';

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  totalSites: number;
  exportCount: number;
  averageSessionDuration: number;
  popularFeatures: Array<{ feature: string; count: number }>;
  userRetention: number;
  conversionRate: number;
}

export interface UserAnalytics {
  userId: string;
  email: string;
  plan: 'free' | 'pro';
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  totalSessions: number;
  averageSessionDuration: number;
  featuresUsed: string[];
  exportCount: number;
  isActive: boolean;
}

export interface SiteAnalytics {
  siteId: string;
  userEmail: string;
  pageCount: number;
  lastModified: string;
  exportCount: number;
  previewCount: number;
  averageLoadTime: number;
  componentsUsed: string[];
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  memoryUsage: number;
  errorRate: number;
  cacheHitRate: number;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private performanceObserver: PerformanceObserver | null = null;
  private errorCount = 0;
  private apiCallCount = 0;
  private apiTotalTime = 0;

  private constructor() {
    this.initializePerformanceTracking();
    this.initializeErrorTracking();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // User Behavior Tracking
  trackPageView(page: string, userId?: string): void {
    apiService.trackEvent('page_view', {
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
    }, userId);
  }

  trackFeatureUsage(feature: string, properties: Record<string, unknown> = {}, userId?: string): void {
    apiService.trackEvent('feature_used', {
      feature,
      ...properties,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  trackExport(exportType: string, pageCount: number, userId?: string): void {
    apiService.trackEvent('site_exported', {
      exportType,
      pageCount,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  trackPreview(pageCount: number, userId?: string): void {
    apiService.trackEvent('preview_opened', {
      pageCount,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  trackLogin(method: string, userId?: string): void {
    apiService.trackEvent('user_login', {
      method,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  trackSignup(plan: string, userId?: string): void {
    apiService.trackEvent('user_signup', {
      plan,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  // Performance Tracking
  private initializePerformanceTracking(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.trackPageLoadTime(navEntry.loadEventEnd - navEntry.loadEventStart);
          }
        }
      });

      this.performanceObserver.observe({ entryTypes: ['navigation'] });
    }
  }

  private initializeErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.trackError(event.error?.message || 'Unknown error', event.filename, event.lineno);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason?.message || 'Unhandled promise rejection', 'unknown', 0);
    });
  }

  private trackPageLoadTime(loadTime: number): void {
    apiService.trackEvent('performance_page_load', {
      loadTime,
      timestamp: new Date().toISOString(),
    });
  }

  private trackError(message: string, filename: string, lineNumber: number): void {
    this.errorCount++;
    apiService.trackEvent('error_occurred', {
      message,
      filename,
      lineNumber,
      timestamp: new Date().toISOString(),
    });
  }

  // API Performance Tracking
  trackApiCall(endpoint: string, duration: number, success: boolean): void {
    this.apiCallCount++;
    this.apiTotalTime += duration;

    apiService.trackEvent('api_call', {
      endpoint,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  // Analytics Dashboard Data
  async getAnalyticsMetrics(): Promise<AnalyticsMetrics> {
    // This would typically fetch from a dedicated analytics database
    // For now, we'll return mock data
    return {
      totalUsers: 1250,
      activeUsers: 342,
      totalSites: 1890,
      exportCount: 567,
      averageSessionDuration: 8.5,
      popularFeatures: [
        { feature: 'page_editor', count: 1234 },
        { feature: 'preview', count: 890 },
        { feature: 'export', count: 567 },
        { feature: 'templates', count: 345 },
      ],
      userRetention: 0.78,
      conversionRate: 0.15,
    };
  }

  async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    // This would fetch user-specific analytics
    // For now, return mock data
    return {
      userId,
      email: 'user@example.com',
      plan: 'free',
      firstVisit: '2024-01-15T10:30:00Z',
      lastVisit: new Date().toISOString(),
      totalVisits: 15,
      totalSessions: 8,
      averageSessionDuration: 12.5,
      featuresUsed: ['page_editor', 'preview', 'export'],
      exportCount: 3,
      isActive: true,
    };
  }

  async getSiteAnalytics(siteId: string): Promise<SiteAnalytics | null> {
    // This would fetch site-specific analytics
    // For now, return mock data
    return {
      siteId,
      userEmail: 'user@example.com',
      pageCount: 4,
      lastModified: new Date().toISOString(),
      exportCount: 2,
      previewCount: 8,
      averageLoadTime: 1.2,
      componentsUsed: ['hero', 'navbar', 'footer', 'contact_form'],
    };
  }

  getPerformanceMetrics(): PerformanceMetrics {
    const errorRate = this.apiCallCount > 0 ? this.errorCount / this.apiCallCount : 0;
    const averageApiTime = this.apiCallCount > 0 ? this.apiTotalTime / this.apiCallCount : 0;

    return {
      pageLoadTime: 1.5, // Mock data
      apiResponseTime: averageApiTime,
      memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0,
      errorRate,
      cacheHitRate: 0.85, // Mock data
    };
  }

  // Session Management
  private sessionStartTime = Date.now();

  getSessionDuration(): number {
    return (Date.now() - this.sessionStartTime) / 1000; // in seconds
  }

  endSession(): void {
    const duration = this.getSessionDuration();
    apiService.trackEvent('session_end', {
      duration,
      timestamp: new Date().toISOString(),
    });
  }

  // Cleanup
  destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    this.endSession();
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance(); 