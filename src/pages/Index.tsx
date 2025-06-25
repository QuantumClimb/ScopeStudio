
import { Link } from "react-router-dom";
import { Palette, Eye, Settings, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">
              Scope<span className="text-indigo-600">Studio</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/pricing" className="text-gray-600 hover:text-gray-800">
                Pricing
              </Link>
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Scope<span className="text-indigo-600">Studio</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            The collaborative wireframing tool that helps developers and clients 
            build amazing websites together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              <Palette className="mr-2" size={20} />
              Start Building Free
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link 
              to="/pricing"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Settings className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Easy Collaboration</h3>
            <p className="text-gray-600">
              Intuitive dashboard with sidebar navigation and form-based content editing. 
              Perfect for developer-client collaboration.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Eye className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h3>
            <p className="text-gray-600">
              See your changes instantly with our real-time wireframe preview system. 
              No more back-and-forth confusion.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
              <Palette className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Export Ready</h3>
            <p className="text-gray-600">
              Generate clean HTML, CSS, and JavaScript files ready for development. 
              From wireframe to code in minutes.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Start Free, Upgrade When Ready
          </h2>
          <p className="text-gray-600 mb-8">
            Get started with 3 pages and 2 subpages each. Upgrade to Pro for $2/month 
            for 6 pages, 5 subpages each, and brandless exports.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start Free
            </Link>
            <Link 
              to="/pricing"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Features
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800 mb-4">
              Scope<span className="text-indigo-600">Studio</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              The wireframing tool for modern development teams
            </p>
            <p className="text-xs text-gray-400">
              Built with <span className="font-medium">Quantum Climb</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
