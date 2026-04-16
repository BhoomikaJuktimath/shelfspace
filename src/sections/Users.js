import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BookOpen, 
  Search, 
  X,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Users = () => {
  const { users, borrowRecords, books, searchQuery } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Get user's borrow history
  const getUserBorrowHistory = (userId) => {
    return borrowRecords.filter(record => record.userId === userId);
  };

  const getUserStats = (userId) => {
    const userRecords = getUserBorrowHistory(userId);
    const activeBorrows = userRecords.filter(record => record.status === 'borrowed').length;
    const overdueBorrows = userRecords.filter(record => record.status === 'overdue').length;
    const totalBorrows = userRecords.length;
    const returnedBooks = userRecords.filter(record => record.status === 'returned').length;
    
    return { activeBorrows, overdueBorrows, totalBorrows, returnedBooks };
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-success/10 text-success border border-success/20',
      inactive: 'bg-danger/10 text-danger border border-danger/20'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const UserCard = ({ user }) => {
    const stats = getUserStats(user.id);
    
    return (
      <div 
        className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/30 transition-all-smooth cursor-pointer"
        onClick={() => {
          setSelectedUser(user);
          setShowUserDetails(true);
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{user.name}</h3>
              <p className="text-sm text-text-secondary">ID: #{user.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
          {getStatusBadge(user.status)}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-text-secondary">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Member since {user.memberSince}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dark-border grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{stats.activeBorrows}</p>
            <p className="text-xs text-text-secondary">Active Books</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{stats.totalBorrows}</p>
            <p className="text-xs text-text-secondary">Total Borrows</p>
          </div>
        </div>

        {stats.overdueBorrows > 0 && (
          <div className="mt-4 flex items-center space-x-2 text-danger">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{stats.overdueBorrows} overdue book(s)</span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-accent-blue">View details</span>
          <ChevronRight className="w-4 h-4 text-accent-blue" />
        </div>
      </div>
    );
  };

  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    const userHistory = getUserBorrowHistory(selectedUser.id);
    const stats = getUserStats(selectedUser.id);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-in">
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedUser.name}</h2>
                  <p className="text-text-secondary">Member ID: #{selectedUser.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary">Email</p>
                      <p className="text-text-primary">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="text-text-primary">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-text-secondary" />
                    <div>
                      <p className="text-sm text-text-secondary">Member Since</p>
                      <p className="text-text-primary">{selectedUser.memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <p className="text-2xl font-bold text-text-primary">{stats.totalBorrows}</p>
                    <p className="text-sm text-text-secondary">Total Borrows</p>
                  </div>
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <p className="text-2xl font-bold text-text-primary">{stats.activeBorrows}</p>
                    <p className="text-sm text-text-secondary">Active Books</p>
                  </div>
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <p className="text-2xl font-bold text-text-primary">{stats.returnedBooks}</p>
                    <p className="text-sm text-text-secondary">Returned</p>
                  </div>
                  <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
                    <p className="text-2xl font-bold text-danger">{stats.overdueBorrows}</p>
                    <p className="text-sm text-text-secondary">Overdue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrow History */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Borrow History</h3>
              <div className="space-y-3">
                {userHistory.length > 0 ? (
                  userHistory.map((record) => {
                    const statusColors = {
                      borrowed: 'bg-warning/10 text-warning border border-warning/20',
                      returned: 'bg-success/10 text-success border border-success/20',
                      overdue: 'bg-danger/10 text-danger border border-danger/20'
                    };

                    return (
                      <div key={record.id} className="bg-dark-bg border border-dark-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <BookOpen className="w-5 h-5 text-accent-blue" />
                            <div>
                              <p className="font-medium text-text-primary">{record.bookTitle}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
                                <span>Borrowed: {record.borrowDate}</span>
                                <span>Due: {record.dueDate}</span>
                                {record.returnDate && <span>Returned: {record.returnDate}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[record.status]}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                            {record.lateFee > 0 && (
                              <span className="text-sm text-danger">Late fee: Rs {record.lateFee}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-text-secondary py-8">No borrow history found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-poppins">Users</h1>
          <p className="text-text-secondary mt-1">Manage library members and view their activity</p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* User Details Modal */}
      {showUserDetails && <UserDetailsModal />}
    </div>
  );
};

export default Users;
