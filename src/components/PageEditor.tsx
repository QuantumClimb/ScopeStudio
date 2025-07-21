import { useState, useEffect } from "react";
import { Save, FileText, Type, Image, Edit3, Eye } from "lucide-react";
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
    <div className="mobile-container">
      <div className="ios-card mobile-p-responsive">
        <div className="mobile-flex-between mobile-stack">
          <div className="mobile-flex-center mobile-inline-stack">
            <FileText className="text-indigo-600" size={24} />
            <div>
              <h2 className="mobile-heading-responsive text-gray-800">
                Edit Page: {data.name || data.title}
              </h2>
              <p className="mobile-text-small text-gray-500 mt-1">
                Customize the content for your page
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className={`mobile-btn-primary mobile-haptic mobile-touch-target ${
              isSaved ? 'bg-green-500' : ''
            }`}
          >
            <Save className="mr-2" size={16} />
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="mobile-grid-responsive gap-8 mt-8">
          {/* Form Section */}
          <div className="mobile-stack">
            <div className="mobile-form-group">
              <label className="mobile-form-label mobile-flex-center">
                <Type size={16} className="mr-2" />
                Page Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleChange("name", e.target.value)}
                className="mobile-form-input"
                placeholder="Enter page name..."
              />
            </div>

            {/* Hero Section */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium text-gray-800 mb-4 mobile-flex-center">
                <Image size={18} className="mr-2" />
                Hero Section
              </h3>
              
              <div className="mobile-stack">
                <div className="mobile-form-group">
                  <label className="mobile-form-label mobile-flex-center">
                    <Type size={16} className="mr-2" />
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitle || ''}
                    onChange={(e) => handleChange("heroTitle", e.target.value)}
                    className="mobile-form-input"
                    placeholder="Enter hero title..."
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label mobile-flex-center">
                    <Type size={16} className="mr-2" />
                    Hero Subheading
                  </label>
                  <input
                    type="text"
                    value={formData.heroSubheading || ''}
                    onChange={(e) => handleChange("heroSubheading", e.target.value)}
                    className="mobile-form-input"
                    placeholder="Enter hero subheading..."
                  />
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label mobile-flex-center">
                    <Image size={16} className="mr-2" />
                    Hero Background Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.heroImageUrl || ''}
                    onChange={(e) => handleChange("heroImageUrl", e.target.value)}
                    className="mobile-form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.heroImageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.heroImageUrl}
                        alt="Hero preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="mobile-card">
              <h3 className="mobile-text-medium text-gray-800 mb-4 mobile-flex-center">
                <Edit3 size={18} className="mr-2" />
                Body Content
              </h3>
              
              <div className="mobile-stack">
                <div className="mobile-form-group">
                  <label className="mobile-form-label mobile-flex-center">
                    <Edit3 size={16} className="mr-2" />
                    Body Content
                  </label>
                  <textarea
                    value={formData.bodyContent || ''}
                    onChange={(e) => handleChange("bodyContent", e.target.value)}
                    className="mobile-form-textarea"
                    placeholder="Enter your page content here..."
                    rows={8}
                  />
                  <p className="mobile-text-small text-gray-500 mt-1">
                    Use line breaks to create paragraphs. You can also use basic markdown-style formatting.
                  </p>
                </div>

                <div className="mobile-form-group">
                  <label className="mobile-form-label mobile-flex-center">
                    <Image size={16} className="mr-2" />
                    Body Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.bodyImageUrl || ''}
                    onChange={(e) => handleChange("bodyImageUrl", e.target.value)}
                    className="mobile-form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.bodyImageUrl && (
                    <div className="mt-2">
                      <img
                        src={formData.bodyImageUrl}
                        alt="Body image preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mobile-only lg:block">
            <div className="mobile-card sticky top-4">
              <h3 className="mobile-text-medium text-gray-800 mb-4 mobile-flex-center">
                <Eye size={18} className="mr-2" />
                Live Preview
              </h3>
              
              <div className="mobile-stack">
                <div className="mobile-card bg-gray-50">
                  <h4 className="mobile-text-medium text-gray-800 mb-2">
                    {formData.heroTitle || 'Hero Title'}
                  </h4>
                  <p className="mobile-text-small text-gray-600">
                    {formData.heroSubheading || 'Hero subheading will appear here'}
                  </p>
                </div>

                <div className="mobile-card bg-gray-50">
                  <h4 className="mobile-text-medium text-gray-800 mb-2">Body Content</h4>
                  <div className="mobile-text-small text-gray-600 whitespace-pre-wrap">
                    {formData.bodyContent || 'Body content will appear here'}
                  </div>
                </div>

                <div className="mobile-text-small text-gray-500 text-center">
                  💡 Changes are saved automatically as you type
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
