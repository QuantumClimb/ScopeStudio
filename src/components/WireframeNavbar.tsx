import { SiteData } from "../types";

interface WireframeNavbarProps {
  siteData: SiteData;
  currentPageId: string;
  onPageChange: (pageId: string) => void;
}

export const WireframeNavbar = ({ 
  siteData, 
  currentPageId,
  onPageChange
}: WireframeNavbarProps) => {

  const handlePageClick = (pageId: string) => {
    onPageChange(pageId);
  };

  return (
    <nav className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo placeholder */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">L</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-800">Logo</span>
          </div>

          {/* Navigation links */}
          <div className="flex space-x-8">
            {siteData.pages
              .filter(page => page.id !== 'home') // Exclude home page from navigation
              .map(page => (
              <div key={`navbar-page-${page.id}`} className="relative">
                <button
                  onClick={() => handlePageClick(page.id)}
                  className={`flex items-center text-sm font-medium transition-colors ${
                    currentPageId === page.id
                      ? "text-indigo-600 border-b-2 border-indigo-600 pb-4"
                      : "text-gray-600 hover:text-gray-900 pb-4"
                  }`}
                >
                  {page.name}
                </button>
              </div>
            ))}
          </div>

          {/* CTA placeholder */}
          <div className="bg-gray-200 px-4 py-2 rounded-md">
            <span className="text-sm text-gray-600">Contact</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
