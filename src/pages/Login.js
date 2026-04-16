import React, { useState } from 'react';
import { Library, Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      // Simple validation for demo
      if (formData.email && formData.password) {
        // Store auth state
        localStorage.setItem('shelfspace_authenticated', 'true');
        localStorage.setItem('shelfspace_user', JSON.stringify({
          email: formData.email,
          name: formData.email.split('@')[0],
          role: 'admin'
        }));
        onLogin();
      } else {
        setError('Please enter both email and password');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Library className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary font-poppins">ShelfSpace</h1>
          <p className="text-text-secondary mt-2">Admin Dashboard Login</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-danger" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="admin@shelfspace.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-bg border border-dark-border rounded-lg">
            <p className="text-sm text-text-secondary mb-2">Demo Credentials:</p>
            <p className="text-xs text-text-secondary">Email: admin@shelfspace.com</p>
            <p className="text-xs text-text-secondary">Password: any password</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-secondary">
            © 2024 ShelfSpace. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
