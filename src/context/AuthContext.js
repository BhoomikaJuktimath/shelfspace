import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Debug authentication state changes
  console.log('AuthContext - State changed:', { isAuthenticated, user });

  // Add a ref to track if we're in the middle of an operation
  const [isOperationInProgress, setIsOperationInProgress] = useState(false);

  useEffect(() => {
    // Check authentication status on mount only
    const authStatus = localStorage.getItem('shelfspace_authenticated');
    const userData = localStorage.getItem('shelfspace_user');
    const darkModeSetting = localStorage.getItem('shelfspace_darkMode');

    console.log('AuthContext - Initial auth check:', { authStatus, userData: !!userData });

    try {
      if (authStatus === 'true' && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        console.log('AuthContext - User authenticated successfully');
      } else {
        console.log('AuthContext - User not authenticated');
      }

      // Apply dark mode setting
      const darkMode = darkModeSetting !== null ? darkModeSetting === 'true' : true;
      setIsDarkMode(darkMode);
      applyDarkMode(darkMode);
    } catch (error) {
      console.error('Error loading auth data from localStorage:', error);
      // Only reset auth state if there's actual auth data corruption
      if (authStatus === 'true' || userData) {
        // If there was auth data but it's corrupted, clear it
        localStorage.removeItem('shelfspace_authenticated');
        localStorage.removeItem('shelfspace_user');
        setIsAuthenticated(false);
        setUser(null);
      }
      // Always apply default dark mode
      setIsDarkMode(true);
      applyDarkMode(true);
    }
  }, []);

  const applyDarkMode = (darkMode) => {
    if (darkMode) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#111827';
    }
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('shelfspace_authenticated', 'true');
    localStorage.setItem('shelfspace_user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthContext - logout() called!');
    console.trace('AuthContext - logout() call stack');
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('shelfspace_authenticated');
    localStorage.removeItem('shelfspace_user');
    // Clear other data
    localStorage.removeItem('shelfspace_books');
    localStorage.removeItem('shelfspace_users');
    localStorage.removeItem('shelfspace_borrowRecords');
    localStorage.removeItem('shelfspace_activities');
    localStorage.removeItem('shelfspace_settings');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyDarkMode(newDarkMode);
    localStorage.setItem('shelfspace_darkMode', newDarkMode.toString());
  };

  const value = {
    isAuthenticated,
    user,
    isDarkMode,
    login,
    logout,
    toggleDarkMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
