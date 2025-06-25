
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const Pricing = () => {
  const features = [
    { name: "Pages", free: "3", pro: "6" },
    { name: "Subpages per page", free: "2", pro: "5" },
    { name: "Image support", free: "Placeholder only", pro: "Full support" },
    { name: "Export functionality", free: "Basic HTML", pro: "Clean export" },
    { name: "Branding removal", free: false, pro: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Scope<span className="text-indigo-600">Studio</span>
            </Link>
            <Link 
              to="/login" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your wireframing needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
                <div className="text-3xl font-bold text-gray-800">$0</div>
                <div className="text-gray-500">forever</div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Up to 3 pages</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>2 subpages per page</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-500 mr-3" size={20} />
                  <span>Basic HTML export</span>
                </li>
                <li className="flex items-center">
                  <X className="text-red-500 mr-3" size={20} />
                  <span>Includes branding</span>
                </li>
              </ul>

              <Link
                to="/login"
                className="w-full block text-center py-2 px-4 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold">$2</div>
                <div className="text-indigo-200">per user/month</div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="text-green-300 mr-3" size={20} />
                  <span>Up to 6 pages</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-300 mr-3" size={20} />
                  <span>5 subpages per page</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-300 mr-3" size={20} />
                  <span>Full image support</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-300 mr-3" size={20} />
                  <span>Clean HTML export</span>
                </li>
                <li className="flex items-center">
                  <Check className="text-green-300 mr-3" size={20} />
                  <span>Remove branding</span>
                </li>
              </ul>

              <Link
                to="/login"
                className="w-full block text-center py-2 px-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Upgrade Now
              </Link>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Feature Comparison
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-800">Feature</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-800">Free</th>
                    <th className="px-6 py-4 text-center font-medium text-gray-800">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={feature.name} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 font-medium text-gray-800">{feature.name}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-red-500 mx-auto" size={20} />
                        ) : (
                          <span className="text-gray-600">{feature.free}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? <Check className="text-green-500 mx-auto" size={20} /> : <X className="text-red-500 mx-auto" size={20} />
                        ) : (
                          <span className="text-gray-600">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            Built with <span className="font-medium">Quantum Climb</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
