import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Eye, FileText } from "lucide-react";
import { SiteData } from "../types";

interface ClientSites {
  [email: string]: SiteData;
}

const AdminDashboard = () => {
  const [clientSites, setClientSites] = useState<ClientSites>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadClientSites();
  }, []);

  const loadClientSites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/clients');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setClientSites(data.clients);
      } else {
        setError(data.error || 'Failed to load client sites');
      }
    } catch (err) {
      console.error('Error loading client sites:', err);
      setError('Failed to connect to server. Using demo data.');
      
      // Demo data for development
      setClientSites({
        'client1@example.com': {
          pages: [
            {
              id: 'home',
              name: 'Home',
              title: 'Welcome to Client 1',
              description: 'Client 1 homepage',
              heroTitle: 'Client 1 Business',
              heroSubheading: 'We provide excellent services',
              heroImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
              bodyContent: 'This is client 1\'s content that they\'ve updated.',
              bodyImageUrl: ''
            }
          ]
        },
        'client2@example.com': {
          pages: [
            {
              id: 'home',
              name: 'Home',
              title: 'Client 2 Homepage',
              description: 'Client 2 site',
              heroTitle: 'Client 2 Company',
              heroSubheading: 'Leading the industry forward',
              heroImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
              bodyContent: 'Client 2 has made several updates to their content.',
              bodyImageUrl: ''
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Loading client sites...</h2>
        </div>
      </div>
    );
  }

  const clientEmails = Object.keys(clientSites);
  const totalPages = Object.values(clientSites).reduce((sum, site) => sum + site.pages.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Developer Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                View and monitor all client websites
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{clientEmails.length}</div>
              <div className="text-sm text-gray-500">Clients</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{totalPages}</div>
              <div className="text-sm text-gray-500">Total Pages</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-yellow-600 font-medium">Notice:</div>
              <div className="ml-2 text-yellow-700">{error}</div>
            </div>
          </div>
        )}

        {clientEmails.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Client sites will appear here when they start creating content.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clientEmails.map((email) => {
              const siteData = clientSites[email];
              const mainPage = siteData.pages[0];
              
              return (
                <div key={email} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">{email}</h3>
                          <p className="text-sm text-gray-500">{siteData.pages.length} pages</p>
                        </div>
                      </div>
                    </div>

                    {mainPage && (
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{mainPage.heroTitle || mainPage.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {mainPage.heroSubheading || mainPage.description}
                          </p>
                        </div>

                        {mainPage.heroImageUrl && (
                          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                            <img 
                              src={mainPage.heroImageUrl} 
                              alt={mainPage.heroTitle || mainPage.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="text-sm text-gray-600">
                          <div className="line-clamp-3">
                            {mainPage.bodyContent?.substring(0, 150)}...
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex space-x-2">
                      <Link
                        to={`/preview?client=${encodeURIComponent(email)}`}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye size={16} className="mr-1" />
                        Preview
                      </Link>
                      <button
                        onClick={() => console.log('View details for:', email)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <FileText size={16} className="mr-1" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard; 