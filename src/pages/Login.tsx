import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("test@scopestudio.com"); // Default testing email
  const [password, setPassword] = useState("password123"); // Default testing password
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔐 Login attempt:', { email, isSignUp });
    
    // Mock authentication - in real app would connect to backend
    const userData = {
      email,
      plan: "free", // Default to free plan
      isAuthenticated: true
    };
    
    localStorage.setItem('scope-user', JSON.stringify(userData));
    console.log('✅ User authenticated and saved:', userData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Scope<span className="text-indigo-600">Studio</span>
          </h1>
          <p className="text-gray-600">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
          <p className="text-xs text-gray-500 mt-2 bg-yellow-50 p-2 rounded">
            <strong>Testing Mode:</strong> Default credentials pre-filled for easy testing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Lock size={16} className="mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Back to home
          </Link>
        </div>

        {/* Testing Information */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <strong>For Testing:</strong>
          <br />Email: test@scopestudio.com
          <br />Password: password123
          <br />Just click "Sign In" to test!
        </div>
      </div>
    </div>
  );
};

export default Login;
