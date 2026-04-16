import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';

const LogoutModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-md animate-slide-in">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-4">
            <LogOut className="w-6 h-6 text-warning" />
          </div>
          
          <h3 className="text-xl font-bold text-text-primary text-center mb-2">
            Confirm Logout
          </h3>
          
          <p className="text-text-secondary text-center mb-6">
            Are you sure you want to logout? Any unsaved changes will be lost.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border text-text-primary hover:bg-dark-border rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-warning hover:bg-warning/90 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
