import React, { useState, useEffect } from 'react';
import { X, Save, Bell, Palette, Shield, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsModal = ({ onClose, onSave }) => {
  const { isDarkMode, toggleDarkMode } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: isDarkMode,
    autoSave: true,
    currency: 'Rs',
    dateFormat: 'DD/MM/YYYY'
  });

  useEffect(() => {
    setSettings(prev => ({ ...prev, darkMode: isDarkMode }));
  }, [isDarkMode]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleSave = () => {
    localStorage.setItem('shelfspace_settings', JSON.stringify(settings));
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-border rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-accent-blue" />
              General
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">Dark Mode</p>
                  <p className="text-sm text-text-secondary">Use dark theme across the application</p>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isDarkMode ? 'bg-accent-blue' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">Auto Save</p>
                  <p className="text-sm text-text-secondary">Automatically save changes</p>
                </div>
                <button
                  onClick={() => handleChange('autoSave', !settings.autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-accent-blue' : 'bg-dark-border'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-success" />
              Regional
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                >
                  <option value="Rs">Indian Rupee (Rs)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="¥">Japanese Yen (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Date Format</label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-warning" />
              Notifications
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">Email Notifications</p>
                <p className="text-sm text-text-secondary">Receive email alerts for overdue books</p>
              </div>
              <button
                onClick={() => handleChange('notifications', !settings.notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-accent-blue' : 'bg-dark-border'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-danger" />
              Data Management
            </h3>
            <div className="space-y-3">
              <button className="px-4 py-2 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 border border-accent-blue/20 rounded-lg transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-warning/10 text-warning hover:bg-warning/20 border border-warning/20 rounded-lg transition-colors ml-3">
                Backup Data
              </button>
              <button className="px-4 py-2 bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 rounded-lg transition-colors ml-3">
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-dark-border flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-bg border border-dark-border text-text-primary hover:bg-dark-border rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
