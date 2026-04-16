import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3,
  Library,
  Settings,
  LogOut
} from 'lucide-react';
import SettingsModal from './SettingsModal';
import LogoutModal from './LogoutModal';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Books Management', icon: BookOpen },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'borrow-records', label: 'Borrow Records', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleSettingsSave = (settings) => {
    console.log('Settings saved:', settings);
    // Settings are already saved in the modal component
  };

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
            <Library className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary font-poppins">ShelfSpace</h1>
            <p className="text-xs text-text-secondary">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all-smooth ${
                    isActive
                      ? 'bg-accent-blue/20 text-accent-blue border-l-2 border-accent-blue'
                      : 'text-text-secondary hover:text-text-primary hover:bg-dark-border'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-dark-border">
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-border transition-all-smooth"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button 
          onClick={() => setShowLogout(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-all-smooth"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Modals */}
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onSave={handleSettingsSave}
        />
      )}
      
      {showLogout && (
        <LogoutModal 
          onClose={() => setShowLogout(false)} 
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};

export default Sidebar;
