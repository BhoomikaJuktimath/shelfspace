import React, { useState, useEffect, createContext } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './sections/Dashboard';
import BooksManagement from './sections/BooksManagement';
import Users from './sections/Users';
import BorrowRecords from './sections/BorrowRecords';
import Analytics from './sections/Analytics';
import Login from './pages/Login';
import { initialBooks, initialUsers, initialBorrowRecords, initialActivities } from './data/initialData';

export const AppContext = createContext();

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to clear corrupted localStorage data (preserve authentication)
  const clearCorruptedData = () => {
    const keysToClear = [
      'shelfspace_books',
      'shelfspace_users', 
      'shelfspace_borrowRecords',
      'shelfspace_activities'
    ];
    
    // Only clear data-related keys, preserve authentication and settings
    keysToClear.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error clearing ${key}:`, error);
      }
    });
  };

  // Load data from localStorage or use initial data
  useEffect(() => {
    const storedBooks = localStorage.getItem('shelfspace_books');
    const storedUsers = localStorage.getItem('shelfspace_users');
    const storedBorrowRecords = localStorage.getItem('shelfspace_borrowRecords');
    const storedActivities = localStorage.getItem('shelfspace_activities');

    try {
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      } else {
        setBooks(initialBooks);
        localStorage.setItem('shelfspace_books', JSON.stringify(initialBooks));
      }

      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(initialUsers);
        localStorage.setItem('shelfspace_users', JSON.stringify(initialUsers));
      }

      if (storedBorrowRecords) {
        setBorrowRecords(JSON.parse(storedBorrowRecords));
      } else {
        setBorrowRecords(initialBorrowRecords);
        localStorage.setItem('shelfspace_borrowRecords', JSON.stringify(initialBorrowRecords));
      }

      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        setActivities(initialActivities);
        localStorage.setItem('shelfspace_activities', JSON.stringify(initialActivities));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Clear corrupted data and reset to initial data
      clearCorruptedData();
      setBooks(initialBooks);
      setUsers(initialUsers);
      setBorrowRecords(initialBorrowRecords);
      setActivities(initialActivities);
      localStorage.setItem('shelfspace_books', JSON.stringify(initialBooks));
      localStorage.setItem('shelfspace_users', JSON.stringify(initialUsers));
      localStorage.setItem('shelfspace_borrowRecords', JSON.stringify(initialBorrowRecords));
      localStorage.setItem('shelfspace_activities', JSON.stringify(initialActivities));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log('App.js - Saving books to localStorage, count:', books.length);
      if (books.length > 0) {
        localStorage.setItem('shelfspace_books', JSON.stringify(books));
        console.log('App.js - Books saved successfully');
      }
    } catch (error) {
      console.error('Error saving books to localStorage:', error);
    }
  }, [books]);

  useEffect(() => {
    try {
      if (users.length > 0) {
        localStorage.setItem('shelfspace_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (borrowRecords.length > 0) {
        localStorage.setItem('shelfspace_borrowRecords', JSON.stringify(borrowRecords));
      }
    } catch (error) {
      console.error('Error saving borrowRecords to localStorage:', error);
    }
  }, [borrowRecords]);

  useEffect(() => {
    try {
      console.log('App.js - Saving activities to localStorage, count:', activities.length);
      // Always save activities, even if empty, to maintain consistency
      localStorage.setItem('shelfspace_activities', JSON.stringify(activities));
      console.log('App.js - Activities saved successfully');
    } catch (error) {
      console.error('Error saving activities to localStorage:', error);
      // Don't clear data on activities save error to preserve authentication
    }
  }, [activities]);

  const addActivity = (type, description) => {
    const newActivity = {
      id: Date.now(),
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only last 50 activities
  };

  const contextValue = {
    books,
    setBooks,
    users,
    setUsers,
    borrowRecords,
    setBorrowRecords,
    activities,
    setActivities,
    addActivity,
    searchQuery,
    setSearchQuery,
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BooksManagement />;
      case 'users':
        return <Users />;
      case 'borrow-records':
        return <BorrowRecords />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex h-screen bg-dark-bg">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            {renderSection()}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
