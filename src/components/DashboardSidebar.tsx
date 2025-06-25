import { Home, Plus } from "lucide-react";
import { SiteData, UserData } from "../types";

interface DashboardSidebarProps {
  siteData: SiteData;
  activePageId: string;
  onPageSelect: (pageId: string) => void;
  onAddPage: () => void;
  userData: UserData;
}

export const DashboardSidebar = ({ 
  siteData, 
  activePageId,
  onPageSelect, 
  onAddPage,
  userData 
}: DashboardSidebarProps) => {

  const handlePageClick = (pageId: string) => {
    console.log('Page clicked:', pageId);
    onPageSelect(pageId);
  };

  const maxPages = userData.plan === 'pro' ? 6 : 4;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Pages</h2>
        <p className="text-sm text-gray-500 mt-1">
          {siteData.pages.length}/{maxPages} pages used
        </p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {siteData.pages.map((page) => {
            const isPageActive = activePageId === page.id;
            
            return (
              <div key={`sidebar-page-${page.id}`}>
                <button
                  onClick={() => handlePageClick(page.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    isPageActive 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Home size={18} className="mr-3" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{page.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {page.title}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add New Page Button */}
        {siteData.pages.length < maxPages && (
          <button
            onClick={onAddPage}
            className="w-full mt-4 flex items-center px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Plus size={18} className="mr-3" />
            <span>Add New Page</span>
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div className="font-medium mb-1">ScopeStudio v1.0</div>
          <div>by Quantum Climb</div>
        </div>
      </div>
    </div>
  );
};
