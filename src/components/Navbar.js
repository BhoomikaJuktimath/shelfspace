import React, { useContext } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { AppContext } from '../App';

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useContext(AppContext);

  return (
    <div className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search books, users, or records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-blue transition-all-smooth"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-dark-border rounded-lg transition-all-smooth">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-dark-border">
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary">Admin User</p>
            <p className="text-xs text-text-secondary">Library Administrator</p>
          </div>
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 hover:bg-dark-border rounded-lg transition-all-smooth">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
