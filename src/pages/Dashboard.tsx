import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { PageEditor } from "../components/PageEditor";
import { Eye, ArrowLeft, Plus } from "lucide-react";
import { SiteData, SitePageData, UserData } from "../types";
import { SupabaseClientService } from "../services/supabase-client";
import { ExportDialog } from "../components/ExportDialog";
import { MobileNavigation } from "../components/MobileNavigation";
import { MobileBottomNavigation } from "../components/MobileBottomNavigation";
import { useMobile } from "../hooks/use-mobile";
import { analyticsService } from "../services/analytics-service";

const Dashboard = () => {
  const [activePageId, setActivePageId] = useState<string>("");
  const { isMobile, shouldShowSidebar, shouldShowMobileMenu } = useMobile();
  
  // Default site structure with ready-made pages (only used for new users)
  const defaultSiteData: SiteData = {
    pages: [
      {
        id: "home",
        name: "Home",
        title: "Build Better Websites, Faster",
        description: "Scope Studio helps you turn client copy into clean wireframes — instantly.",
        heroTitle: "Build Better Websites, Faster",
        heroSubheading: "Scope Studio helps you turn client copy into clean wireframes — instantly.",
        heroImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
        bodyContent: "No more back-and-forth over Word docs. Just write the content and see it come to life.\n\nScope Studio is your bridge between raw copy and real layout. It helps developers, writers, and clients stay aligned from day one.\n\nLaunch a visual wireframe with your content, get feedback, and export HTML/CSS when you're ready to build.\n\n• Edit hero sections and body text for each page\n• Add multiple pages and subpages to structure your site\n• Preview wireframes before design or code\n• Export clean HTML, CSS, and JS for dev handoff",
        bodyImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
      },
      {
        id: "about",
        name: "About",
        title: "Made for Real-World Teams",
        description: "Whether you're a solo dev or part of an agency, Scope Studio keeps things moving.",
        heroTitle: "Made for Real-World Teams",
        heroSubheading: "Whether you're a solo dev or part of an agency, Scope Studio keeps things moving.",
        heroImageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop",
        bodyContent: "Scope Studio was created to remove friction from content approval. No waiting on designs or struggling with placeholder text.\n\nBy giving your clients a real preview, you speed up approvals and reduce confusion.\n\nIt's fast, flexible, and designed for anyone who builds websites for a living.\n\n• Simple enough for clients, powerful enough for developers\n• Built with modern web workflows in mind\n• Focus on structure, not styling — that comes later\n• A product by Quantum Climb, a team building tools for the next generation of makers",
        bodyImageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop"
      },
      {
        id: "services",
        name: "Services",
        title: "What You Can Do With Scope Studio",
        description: "It's more than a wireframe. It's a content-first workflow tool.",
        heroTitle: "What You Can Do With Scope Studio",
        heroSubheading: "It's more than a wireframe. It's a content-first workflow tool.",
        heroImageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop",
        bodyContent: "Use Scope Studio to plan websites, landing pages, service sites, or client projects with structured content.\n\nEverything you write is saved and organized, ready for design or development.\n\nExport when you're ready, or share previews with clients for instant feedback.\n\n• Build and preview multiple pages with ease\n• Switch between free and paid plans based on your needs\n• Use placeholder images to sketch out layouts\n• Export clean vanilla HTML/CSS/JS for any project",
        bodyImageUrl: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=400&fit=crop"
      },
      {
        id: "contact",
        name: "Contact",
        title: "Get Started Today",
        description: "Ready to streamline your workflow? Let's build something together.",
        heroTitle: "Get Started Today",
        heroSubheading: "Ready to streamline your workflow? Let's build something together.",
        heroImageUrl: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&h=600&fit=crop",
        bodyContent: "Ready to try Scope Studio? Sign up for free and start wireframing your next project.\n\nNeed help getting started? Our team is here to support you every step of the way.\n\nJoin thousands of developers, designers, and agencies already using Scope Studio to build better websites faster.\n\n• Start with the free plan — no credit card required\n• Upgrade to Pro when you need more features\n• Get support from our team when you need it\n• Join our community of makers and builders",
        bodyImageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
      }
    ]
  };

  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const getUserData = async (): Promise<UserData | null> => {
    // For now, still use localStorage directly for user data
    // Later we can move this to SupabaseClientService too
    const savedUser = localStorage.getItem('scope-user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser) as UserData;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  // Load user data and site data on mount
  useEffect(() => {
    const loadData = async () => {
      console.log('🔄 Loading user and site data...');
      
      const userData = await getUserData();
      
      // Track dashboard page view
      analyticsService.trackPageView('dashboard', userData?.email);
      console.log('👤 Loaded user data:', userData);
      setUserData(userData);
      
      if (userData) {
        try {
          console.log('🔍 [DEBUG] Checking for existing site data for user:', userData.email);
          const existingSiteData = await SupabaseClientService.getSiteData(userData.email);
          
          console.log('🔍 [DEBUG] SupabaseClientService.getSiteData returned:', existingSiteData);
          
          // Check if user has valid starter content (all 4 pages: home, about, services, contact)
          const hasValidStarterContent = existingSiteData && 
            existingSiteData.pages && 
            existingSiteData.pages.length >= 4 &&
            existingSiteData.pages.some(p => p.id === 'home') &&
            existingSiteData.pages.some(p => p.id === 'about') &&
            existingSiteData.pages.some(p => p.id === 'services') &&
            existingSiteData.pages.some(p => p.id === 'contact');
          
          if (hasValidStarterContent) {
            console.log('📥 [DEBUG] Found valid existing data, loading...');
            console.log('📊 [DEBUG] Loaded existing site data:', {
              pagesCount: existingSiteData.pages?.length || 0,
              pageIds: existingSiteData.pages?.map((p: SitePageData) => p.id) || [],
              pages: existingSiteData.pages?.map((p: SitePageData) => ({ id: p.id, name: p.name, title: p.title })) || []
            });
            
            console.log('🔄 [DEBUG] Setting site data state with existing data');
            setSiteData(existingSiteData);
            const firstPageId = existingSiteData.pages[0]?.id || "";
            console.log('🎯 [DEBUG] Setting active page ID to:', firstPageId);
            setActivePageId(firstPageId);
          } else {
            console.log('📭 [DEBUG] No valid starter content found, initializing with starter content...');
            console.log('📊 [DEBUG] Default site data:', {
              pagesCount: defaultSiteData.pages?.length || 0,
              pageIds: defaultSiteData.pages?.map((p: SitePageData) => p.id) || []
            });
            // Always initialize with defaults for new users or users without valid starter content
            setSiteData(defaultSiteData);
            await saveSiteData(defaultSiteData, userData);
            const firstPageId = defaultSiteData.pages[0]?.id || "";
            console.log('🎯 [DEBUG] Setting active page ID to default:', firstPageId);
            setActivePageId(firstPageId);
          }
        } catch (error) {
          console.error('❌ [DEBUG] Error loading site data:', error);
          // On error, use defaults and save them
          setSiteData(defaultSiteData);
          await saveSiteData(defaultSiteData, userData);
          setActivePageId(defaultSiteData.pages[0].id);
        }
      } else {
        console.log('👤 No user data available');
        const firstPageId = defaultSiteData.pages[0]?.id || "";
        console.log('🎯 Setting active page ID to default (no user):', firstPageId);
        setActivePageId(firstPageId);
      }
      
      setIsInitialized(true);
    };

    loadData();
  }, []); // Keep empty dependency array since this should only run once on mount

  const saveSiteData = async (newSiteData: SiteData, user?: UserData) => {
    console.log('🔍 [DEBUG] saveSiteData called with:', {
      pagesCount: newSiteData.pages.length,
      user: user?.email || userData?.email,
      pages: newSiteData.pages.map(p => ({ id: p.id, name: p.name, title: p.title }))
    });
    
    // Validate the data structure before saving
    if (!newSiteData || !newSiteData.pages) {
      console.error('❌ [DEBUG] Invalid site data structure:', newSiteData);
      return;
    }
    
    console.log('🔄 [DEBUG] Setting local state with new site data');
    setSiteData(newSiteData);
    
    const currentUser = user || userData;
    if (currentUser) {
      try {
        console.log('💾 [DEBUG] Calling SupabaseClientService.saveSiteData for:', currentUser.email);
        const success = await SupabaseClientService.saveSiteData(currentUser.email, newSiteData);
        if (success === true) {
          console.log('✅ [DEBUG] Successfully saved site data to Supabase:', {
            userEmail: currentUser.email,
            pagesCount: newSiteData.pages.length,
            success: success
          });
        } else {
          console.error('❌ [DEBUG] Supabase save failed or returned unexpected value:', success);
        }
      } catch (error) {
        console.error('❌ [DEBUG] Error saving site data to Supabase:', error);
      }
    } else {
      console.warn('⚠️ [DEBUG] No user data available, cannot save site data');
    }
  };

  const updatePageData = async (pageId: string, data: Partial<SitePageData>) => {
    console.log('🔍 [DEBUG] updatePageData called:', { 
      pageId, 
      dataKeys: Object.keys(data),
      dataValues: Object.values(data).map(v => typeof v === 'string' ? v.substring(0, 50) + '...' : v)
    });
    
    const updatedSiteData = {
      ...siteData,
      pages: siteData.pages.map(page =>
        page.id === pageId ? { ...page, ...data } : page
      )
    };
    
    await saveSiteData(updatedSiteData);
  };

  const addNewPage = async () => {
    const newPageId = `page-${Date.now()}`;
    const newPage: SitePageData = {
      id: newPageId,
      name: `New Page ${siteData.pages.length + 1}`,
      title: `New Page ${siteData.pages.length + 1}`,
      description: "Add your page description here",
      heroTitle: "Your Hero Title",
      heroSubheading: "Your hero subheading goes here",
      bodyContent: "Add your page content here..."
    };

    const updatedSiteData = {
      ...siteData,
      pages: [...siteData.pages, newPage]
    };

    await saveSiteData(updatedSiteData);
    setActivePageId(newPageId);
  };

  const handlePageSelect = (pageId: string) => {
    console.log('🔍 [DEBUG] handlePageSelect called with pageId:', pageId);
    setActivePageId(pageId);
  };

  const handleExport = () => {
    console.log('📤 Export triggered');
    // Export functionality is handled by ExportDialog component
  };

  const handlePreview = () => {
    console.log('👁️ Preview triggered');
    // Preview functionality is handled by the Link component
  };

  const currentPage = siteData.pages.find(page => page.id === activePageId);

  if (!userData) {
    return (
      <div className="min-h-screen mobile-flex-center mobile-container">
        <div className="mobile-card text-center">
          <h2 className="mobile-text-large mb-4">Please Log In</h2>
          <p className="mobile-text-small mb-6">
            You need to be logged in to access the dashboard.
          </p>
          <Link to="/login" className="mobile-btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen mobile-flex-center">
        <div className="mobile-loading">
          <div className="mobile-loading-spinner"></div>
          <p className="mobile-text-small mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      {shouldShowSidebar && (
        <DashboardSidebar 
          siteData={siteData}
          activePageId={activePageId}
          onPageSelect={handlePageSelect}
          onAddPage={addNewPage}
          userData={userData}
        />
      )}
      
      {/* Mobile Navigation */}
      {shouldShowMobileMenu && (
        <MobileNavigation
          userData={userData}
          siteData={siteData}
          activePageId={activePageId}
          onPageSelect={handlePageSelect}
          onExport={handleExport}
          onPreview={handlePreview}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="ios-header mobile-safe-top">
          <div className="mobile-container">
            <div className="mobile-flex-between mobile-py">
              <div className="mobile-flex-center mobile-inline-stack">
                <Link to="/" className="mobile-haptic">
                  <ArrowLeft size={20} className="text-gray-500" />
                </Link>
                <div>
                  <h1 className="mobile-heading-responsive text-gray-800">
                    ScopeStudio Dashboard
                  </h1>
                  <p className="mobile-text-small text-gray-500">
                    {userData.email} • {userData.plan} plan
                  </p>
                </div>
              </div>
              <div className="mobile-flex-center mobile-inline-stack">
                <ExportDialog 
                  siteData={siteData}
                  userData={userData}
                  onExport={() => console.log('✅ Site exported successfully')}
                />
                <Link 
                  to="/preview"
                  className="mobile-btn-primary mobile-haptic"
                >
                  <Eye className="mr-2" size={16} />
                  <span className="mobile-only">Preview</span>
                  <span className="desktop-only">Launch Preview</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 mobile-container mobile-section mobile-safe-bottom">
          {/* Welcome message for new users with starter content */}
          {siteData.pages.length === 4 && 
           siteData.pages.some(p => p.id === 'home') &&
           siteData.pages.some(p => p.id === 'about') &&
           siteData.pages.some(p => p.id === 'services') &&
           siteData.pages.some(p => p.id === 'contact') && (
            <div className="mobile-card mb-6 bg-blue-50 border-blue-200">
              <div className="mobile-flex-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="mobile-text-medium text-blue-800">
                    Welcome to ScopeStudio! 🎉
                  </h3>
                  <div className="mt-2 mobile-text-small text-blue-700">
                    <p>You're starting with our starter content: <strong>Home</strong>, <strong>About</strong>, <strong>Services</strong>, and <strong>Contact</strong> pages.</p>
                    <p className="mt-1">Edit any page to see your changes in real-time, then click "Launch Preview" to see your wireframe!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentPage ? (
            <PageEditor
              pageId={activePageId}
              data={currentPage}
              onUpdate={(data) => updatePageData(activePageId, data)}
            />
          ) : (
            <div className="mobile-empty">
              <div className="mobile-empty-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="mobile-empty-title">
                No page selected
              </h3>
              <p className="mobile-empty-description">
                Select a page from the sidebar to start editing
              </p>
              <button
                onClick={addNewPage}
                className="mobile-btn-primary mobile-haptic mt-4"
              >
                <Plus className="mr-2" size={16} />
                Add New Page
              </button>
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNavigation
          onPreview={handlePreview}
          onExport={handleExport}
          activePageId={activePageId}
        />
      </div>
    </div>
  );
};

export default Dashboard;
