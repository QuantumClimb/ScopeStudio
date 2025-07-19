import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { PageEditor } from "../components/PageEditor";
import { Eye, ArrowLeft, Download, Plus } from "lucide-react";
import { SiteData, SitePageData, UserData } from "../types";
import { SupabaseClientService } from "../services/supabase-client";

const Dashboard = () => {
  const [activePageId, setActivePageId] = useState<string>("");
  
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
      console.log('👤 Loaded user data:', userData);
      setUserData(userData);
      
      if (userData) {
        try {
          console.log('🔍 Checking for existing site data...');
          const existingSiteData = await SupabaseClientService.getSiteData(userData.email);
          
          if (existingSiteData && existingSiteData.pages && existingSiteData.pages.length > 0) {
            console.log('📥 Found existing data, loading...');
            console.log('📊 Loaded existing site data:', {
              pagesCount: existingSiteData.pages?.length || 0,
              pageIds: existingSiteData.pages?.map((p: SitePageData) => p.id) || []
            });
            
            setSiteData(existingSiteData);
            const firstPageId = existingSiteData.pages[0]?.id || "";
            console.log('🎯 Setting active page ID to:', firstPageId);
            setActivePageId(firstPageId);
          } else {
            console.log('📭 No existing data found, initializing with starter content...');
            // Only initialize with defaults if no data exists
            setSiteData(defaultSiteData);
            await saveSiteData(defaultSiteData, userData);
            const firstPageId = defaultSiteData.pages[0]?.id || "";
            console.log('🎯 Setting active page ID to default:', firstPageId);
            setActivePageId(firstPageId);
          }
        } catch (error) {
          console.error('❌ Error loading site data:', error);
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
    console.log('💾 Saving site data:', {
      pagesCount: newSiteData.pages.length,
      user: user?.email || userData?.email
    });
    
    // Validate the data structure before saving
    if (!newSiteData || !newSiteData.pages) {
      console.error('❌ Invalid site data structure:', newSiteData);
      return;
    }
    
    setSiteData(newSiteData);
    
    const currentUser = user || userData;
    if (currentUser) {
      try {
        const success = await SupabaseClientService.saveSiteData(currentUser.email, newSiteData);
        if (success) {
          console.log('✅ Successfully saved site data:', {
            userEmail: currentUser.email,
            pagesCount: newSiteData.pages.length
          });
        } else {
          console.error('❌ Failed to save site data');
        }
      } catch (error) {
        console.error('❌ Error saving site data:', error);
      }
    } else {
      console.warn('⚠️ No user data available, cannot save site data');
    }
  };

  const updatePageData = async (pageId: string, data: Partial<SitePageData>) => {
    console.log('📝 Updating page data:', { pageId, data });
    
    const newSiteData = {
      ...siteData,
      pages: siteData.pages.map(page => 
        page.id === pageId 
          ? { ...page, ...data } 
          : page
      )
    };
    
    await saveSiteData(newSiteData);
  };

  const addNewPage = async () => {
    console.log('🆕 Adding new page...');
    
    if (!userData) {
      console.error('❌ No user data available for adding page');
      return;
    }
    
    const maxPages = userData.plan === 'pro' ? 6 : 4; // Increased limit since no subpages
    console.log(`📊 Current pages: ${siteData.pages.length}, Max allowed: ${maxPages}`);
    
    if (siteData.pages.length >= maxPages) {
      const message = `You've reached the maximum number of pages for your ${userData.plan} plan.`;
      console.warn('⚠️', message);
      alert(message);
      return;
    }

    const newPageId = `page-${Date.now()}`;
    const newPage: SitePageData = {
      id: newPageId,
      name: `Page ${siteData.pages.length + 1}`,
      title: "New Page",
      description: "Description for new page",
      heroTitle: "New Page Title",
      heroSubheading: "Page subheading",
      heroImageUrl: "",
      bodyContent: "Add your content here.",
      bodyImageUrl: ""
    };

    console.log('📄 Created new page object:', newPage);

    const newSiteData = {
      ...siteData,
      pages: [...siteData.pages, newPage]
    };
    
    await saveSiteData(newSiteData);
    setActivePageId(newPageId);
    
    console.log('✅ New page added and set as active:', newPageId);
  };

  const exportSite = () => {
    if (!userData || !siteData) {
      alert('No data to export');
      return;
    }

    try {
      // Create export data with metadata
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          userEmail: userData.email,
          plan: userData.plan,
          version: '1.0'
        },
        siteData: siteData
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create downloadable file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `scopestudio-${userData.email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      console.log('✅ Site data exported successfully');
      alert('Site data exported successfully!');
    } catch (error) {
      console.error('❌ Error exporting site data:', error);
      alert('Error exporting site data. Please try again.');
    }
  };

  const handlePageSelect = (pageId: string) => {
    console.log('Selecting page:', pageId);
    setActivePageId(pageId);
  };

  const currentPage = siteData.pages.find(p => p.id === activePageId) || siteData.pages[0];

  console.log('🔍 Dashboard state:', { 
    activePageId, 
    currentPageExists: !!currentPage,
    totalPages: siteData.pages.length,
    pageIds: siteData.pages.map(p => p.id),
    isInitialized 
  });

  // If no current page found but we have pages, select the first one
  useEffect(() => {
    if (isInitialized && siteData.pages.length > 0 && !siteData.pages.find(p => p.id === activePageId)) {
      const firstPageId = siteData.pages[0].id;
      console.log('🔄 No current page found, defaulting to first page:', firstPageId);
      setActivePageId(firstPageId);
    }
  }, [activePageId, siteData.pages, isInitialized]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Please log in to access the dashboard</h2>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar 
        siteData={siteData}
        activePageId={activePageId}
        onPageSelect={handlePageSelect}
        onAddPage={addNewPage}
        userData={userData}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  ScopeStudio Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  {userData.email} • {userData.plan} plan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportSite}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="mr-2" size={16} />
                Export Site
              </button>
              <Link 
                to="/preview"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Eye className="mr-2" size={16} />
                Launch Preview
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {currentPage ? (
            <PageEditor
              pageId={activePageId}
              data={currentPage}
              onUpdate={(data) => updatePageData(activePageId, data)}
            />
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No page selected
                </h3>
                <p className="text-gray-600 mb-4">
                  Select a page from the sidebar to start editing
                </p>
                <button
                  onClick={addNewPage}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="mr-2" size={16} />
                  Add New Page
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
