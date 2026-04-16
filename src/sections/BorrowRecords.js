import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { 
  FileText, 
  Calendar, 
  User, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Filter,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const BorrowRecords = () => {
  const { borrowRecords, books, users, setBorrowRecords, addActivity, searchQuery } = useContext(AppContext);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = borrowRecords.filter(record => 
      record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    // Sort records
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.borrowDate) - new Date(a.borrowDate);
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'userName':
          return a.userName.localeCompare(b.userName);
        case 'bookTitle':
          return a.bookTitle.localeCompare(b.bookTitle);
        default:
          return 0;
      }
    });
  }, [borrowRecords, searchQuery, selectedStatus, sortBy]);

  const calculateLateFee = (dueDate, returnDate = null) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const daysOverdue = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 ? daysOverdue * 5 : 0; // ₹5 per day
  };

  const handleReturnBook = (recordId) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (record) {
      const updatedRecords = borrowRecords.map(r => {
        if (r.id === recordId) {
          const returnDate = new Date().toISOString().split('T')[0];
          const lateFee = calculateLateFee(r.dueDate, returnDate);
          return {
            ...r,
            status: 'returned',
            returnDate,
            lateFee
          };
        }
        return r;
      });
      
      setBorrowRecords(updatedRecords);
      
      // Update book status to available
      const book = books.find(b => b.id === record.bookId);
      if (book) {
        // This would need to be handled in the App context
        addActivity('return', `${record.userName} returned '${record.bookTitle}'`);
      }
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      borrowed: 'bg-warning/10 text-warning border border-warning/20',
      returned: 'bg-success/10 text-success border border-success/20',
      overdue: 'bg-danger/10 text-danger border border-danger/20'
    };
    
    const icons = {
      borrowed: <Clock className="w-3 h-3" />,
      returned: <CheckCircle className="w-3 h-3" />,
      overdue: <AlertTriangle className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </span>
    );
  };

  const getOverdueDays = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return daysOverdue > 0 ? daysOverdue : 0;
  };

  const RecordCard = ({ record }) => {
    const overdueDays = getOverdueDays(record.dueDate);
    const isOverdue = record.status === 'borrowed' && overdueDays > 0;
    const status = isOverdue ? 'overdue' : record.status;

    return (
      <div className={`bg-dark-card border ${isOverdue ? 'border-danger/50' : 'border-dark-border'} rounded-xl p-6 hover:border-accent-blue/30 transition-all-smooth`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${isOverdue ? 'bg-danger/20' : 'bg-accent-blue/20'} rounded-lg flex items-center justify-center`}>
              <FileText className={`w-5 h-5 ${isOverdue ? 'text-danger' : 'text-accent-blue'}`} />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">{record.bookTitle}</h4>
              <p className="text-sm text-text-secondary">by {record.userName}</p>
            </div>
          </div>
          {getStatusBadge(status)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>Borrowed</span>
            </div>
            <span className="text-text-primary">{record.borrowDate}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>Due Date</span>
            </div>
            <span className={`${isOverdue ? 'text-danger font-medium' : 'text-text-primary'}`}>
              {record.dueDate}
              {isOverdue && ` (${overdueDays} days overdue)`}
            </span>
          </div>

          {record.returnDate && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-text-secondary">
                <CheckCircle className="w-4 h-4" />
                <span>Returned</span>
              </div>
              <span className="text-text-primary">{record.returnDate}</span>
            </div>
          )}

          {(record.lateFee > 0 || isOverdue) && (
            <div className="flex items-center justify-between text-sm pt-3 border-t border-dark-border">
              <div className="flex items-center space-x-2 text-danger">
                <DollarSign className="w-4 h-4" />
                <span>Late Fee</span>
              </div>
              <span className="text-danger font-medium">
                Rs {isOverdue ? overdueDays * 5 : record.lateFee}
              </span>
            </div>
          )}
        </div>

        {record.status === 'borrowed' && (
          <button
            onClick={() => handleReturnBook(record.id)}
            className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-success/10 text-success hover:bg-success/20 border border-success/20 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mark as Returned</span>
          </button>
        )}
      </div>
    );
  };

  const stats = useMemo(() => {
    const total = borrowRecords.length;
    const borrowed = borrowRecords.filter(r => r.status === 'borrowed').length;
    const returned = borrowRecords.filter(r => r.status === 'returned').length;
    const overdue = borrowRecords.filter(r => r.status === 'overdue').length + 
                   borrowRecords.filter(r => r.status === 'borrowed' && getOverdueDays(r.dueDate) > 0).length;
    const totalLateFees = borrowRecords.reduce((sum, r) => sum + (r.lateFee || 0), 0);

    return { total, borrowed, returned, overdue, totalLateFees };
  }, [borrowRecords]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-poppins">Borrow Records</h1>
          <p className="text-text-secondary mt-1">Track all book borrowing transactions and overdue items</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Records</p>
              <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-accent-blue opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Active</p>
              <p className="text-2xl font-bold text-warning">{stats.borrowed}</p>
            </div>
            <Clock className="w-8 h-8 text-warning opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Returned</p>
              <p className="text-2xl font-bold text-success">{stats.returned}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Overdue</p>
              <p className="text-2xl font-bold text-danger">{stats.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-danger opacity-50" />
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Late Fees</p>
              <p className="text-2xl font-bold text-accent-purple">Rs {stats.totalLateFees}</p>
            </div>
            <DollarSign className="w-8 h-8 text-accent-purple opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-text-secondary" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          >
            <option value="all">All Status</option>
            <option value="borrowed">Borrowed</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          >
            <option value="date">Sort by Date</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="userName">Sort by User</option>
            <option value="bookTitle">Sort by Book</option>
          </select>
        </div>

        <div className="text-sm text-text-secondary">
          Showing {filteredRecords.length} of {borrowRecords.length} records
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
};

export default BorrowRecords;
