import { useState, useEffect } from "react";
import { Save, FileText, Type, Image, Edit3 } from "lucide-react";
import { SitePageData } from "@/types";

interface PageEditorProps {
  pageId: string;
  data: SitePageData;
  onUpdate: (data: Partial<SitePageData>) => void;
}

export const PageEditor = ({ pageId, data, onUpdate }: PageEditorProps) => {
  const [formData, setFormData] = useState<SitePageData>(data);
  const [isSaved, setIsSaved] = useState(false);

  // Update form data when page data changes (when switching pages)
  useEffect(() => {
    setFormData(data);
    setIsSaved(false);
  }, [pageId, data]);

  const handleSave = () => {
    console.log('🔍 [DEBUG] PageEditor handleSave called with formData:', {
      pageId,
      formData: {
        id: formData.id,
        name: formData.name,
        title: formData.title,
        heroTitle: formData.heroTitle,
        heroSubheading: formData.heroSubheading,
        bodyContent: formData.bodyContent?.substring(0, 50) + '...'
      }
    });
    
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange = (field: keyof SitePageData, value: string) => {
    console.log('🔍 [DEBUG] PageEditor handleChange called:', { field, value: value.substring(0, 50) + '...' });
    
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsSaved(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <FileText className="text-indigo-600 mr-3" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Page: {data.name || data.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Customize the content for your page
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Type size={16} className="mr-2" />
                Page Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter page name..."
              />
            </div>

            {/* Hero Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">Hero Section</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Type size={16} className="mr-2" />
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle || ''}
                    onChange={(e) => handleChange("heroTitle", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter hero title..."
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Edit3 size={16} className="mr-2" />
                    Hero Subheading
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubheading || ''}
                    onChange={(e) => handleChange("heroSubheading", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter hero subheading..."
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Image size={16} className="mr-2" />
                    Hero Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroImageUrl || ''}
                    onChange={(e) => handleChange("heroImageUrl", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter image URL..."
                  />
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-4">Body Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="mr-2" />
                    Content
                  </label>
                  <textarea
                    value={formData.bodyContent || ''}
                    onChange={(e) => handleChange("bodyContent", e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    placeholder="Enter body content... Use bullet points with • for lists"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Image size={16} className="mr-2" />
                    Body Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.bodyImageUrl || ''}
                    onChange={(e) => handleChange("bodyImageUrl", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter image URL..."
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                isSaved 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              <Save size={16} className="mr-2" />
              {isSaved ? "Saved!" : "Save Changes"}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
            
            {/* Hero Preview */}
            <div className="bg-white rounded-lg mb-4 overflow-hidden">
              <div 
                className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center relative"
                style={{
                  backgroundImage: formData.heroImageUrl ? `url(${formData.heroImageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="text-center text-white bg-black bg-opacity-50 p-4 rounded">
                  <h4 className="font-bold text-lg">
                    {formData.heroTitle || "Hero Title"}
                  </h4>
                  <p className="text-sm">
                    {formData.heroSubheading || "Hero subheading"}
                  </p>
                </div>
              </div>
            </div>

            {/* Body Preview */}
            <div className="bg-white rounded-lg p-4">
              <div className="space-y-3">
                <div className="text-sm text-gray-800 whitespace-pre-line">
                  {formData.bodyContent || "Body content will appear here..."}
                </div>
                {formData.bodyImageUrl && (
                  <div className="mt-3">
                    <img 
                      src={formData.bodyImageUrl} 
                      alt="Body content" 
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
