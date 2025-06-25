import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WireframeNavbar } from "../components/WireframeNavbar";
import { WireframeHero } from "../components/WireframeHero";
import { WireframeBody } from "../components/WireframeBody";
import { WireframeFooter } from "../components/WireframeFooter";
import { ArrowLeft, Edit } from "lucide-react";
import { SiteData, UserData } from "../types";

const Preview = () => {
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const [siteData, setSiteData] = useState<SiteData>({ pages: [] });
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('scope-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserData(user);
        
        const savedData = localStorage.getItem(`scope-site-${user.email}`);
        if (savedData) {
          const data = JSON.parse(savedData);
          console.log('Loaded site data in preview:', data);
          setSiteData(data);
          if (data.pages.length > 0) {
            setCurrentPageId(data.pages[0].id);
          }
        }
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  const handlePageChange = (pageId: string) => {
    console.log('Preview page change:', pageId);
    setCurrentPageId(pageId);
  };

  const currentPage = siteData.pages.find(p => p.id === currentPageId);

  console.log('Preview state:', { 
    currentPageId, 
    currentPage
  });

  if (!userData || !currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading preview...</h2>
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
