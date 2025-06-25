
interface WireframeBodyProps {
  content: string;
  imageUrl?: string;
  pageType: string;
}

export const WireframeBody = ({ content, imageUrl, pageType }: WireframeBodyProps) => {
  // Process content to handle bullet points
  const processContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={index} className="ml-4">
            {line.replace(/^[•-]\s*/, '')}
          </li>
        );
      }
      return line.trim() ? (
        <p key={index} className="mb-4">
          {line}
        </p>
      ) : null;
    }).filter(Boolean);
  };

  const getPageSpecificContent = () => {
    switch (pageType.toLowerCase()) {
      case "home":
        return (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Feature One</h3>
              <p className="text-gray-600">Description of your first key feature or service.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Feature Two</h3>
              <p className="text-gray-600">Description of your second key feature or service.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Feature Three</h3>
              <p className="text-gray-600">Description of your third key feature or service.</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="prose prose-gray max-w-none">
                {processContent(content)}
              </div>
            </div>
            
            {imageUrl && (
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Content illustration" 
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.className = 'w-full h-64 bg-gray-200 flex items-center justify-center';
                    e.currentTarget.alt = 'Image placeholder';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {getPageSpecificContent()}
      </div>
    </section>
  );
};
