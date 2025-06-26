import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WireframeNavbar } from "../components/WireframeNavbar";
import { WireframeHero } from "../components/WireframeHero";
import { WireframeBody } from "../components/WireframeBody";
import { WireframeFooter } from "../components/WireframeFooter";
import { ArrowLeft, Edit } from "lucide-react";
import { SiteData, UserData } from "../types";
import { RedisDataService } from "../api/redis-service";

const Preview = () => {
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const [siteData, setSiteData] = useState<SiteData>({ pages: [] });
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data using RedisDataService on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // First try to get user from localStorage (logged in session)
        const savedUser = localStorage.getItem('scope-user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setUserData(user);
          
          // Get site data using RedisDataService (handles both dev and prod)
          const siteData = await RedisDataService.getSiteData(user.email);
          if (siteData) {
            console.log('✅ Loaded site data in preview:', siteData);
            setSiteData(siteData);
            if (siteData.pages.length > 0) {
              setCurrentPageId(siteData.pages[0].id);
            }
          } else {
            console.log('❌ No site data found for preview');
          }
        }
      } catch (error) {
        console.error('❌ Error loading preview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePageChange = (pageId: string) => {
    console.log('🔄 Preview page change:', pageId);
    setCurrentPageId(pageId);
  };

  const currentPage = siteData.pages.find(p => p.id === currentPageId);

  console.log('🔍 Preview state:', { 
    currentPageId, 
    currentPage,
    userData: userData?.email,
    totalPages: siteData.pages.length
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading preview...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!userData || !currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No preview data available</h2>
          <p className="text-gray-600 mb-4">
            {!userData ? 'Please log in first.' : 'No pages found to preview.'}
          </p>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Preview Controls */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-medium">Preview Mode</span>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-400">
            {currentPage.name || currentPage.title}
          </span>
        </div>
        <Link 
          to="/dashboard"
          className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
        >
          <Edit size={14} className="mr-1" />
          Edit
        </Link>
      </div>

      {/* Wireframe Layout */}
      <div className="bg-white border-b shadow-sm">
        <WireframeNavbar 
          siteData={siteData}
          currentPageId={currentPageId} 
          onPageChange={handlePageChange}
        />
      </div>

      <WireframeHero 
        title={currentPage.heroTitle || currentPage.title}
        subheading={currentPage.heroSubheading || currentPage.description}
        imageUrl={currentPage.heroImageUrl}
      />

      <WireframeBody 
        content={currentPage.bodyContent || ""}
        imageUrl={currentPage.bodyImageUrl}
        pageType={currentPage.name || ""}
      />

      <WireframeFooter />
    </div>
  );
};

export default Preview;
