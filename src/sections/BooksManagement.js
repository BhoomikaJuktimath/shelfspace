import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../App';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  Filter,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import BookForm from '../components/BookForm';

const BooksManagement = () => {
  const { books, setBooks, addActivity, searchQuery } = useContext(AppContext);
  const { isAuthenticated, user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Debug authentication state
  console.log('BooksManagement - Auth state:', { isAuthenticated, user });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    status: 'available'
  });

  const genres = ['Programming', 'Self-Help', 'Business', 'Finance', 'Psychology', 'Fiction', 'History', 'Science', 'Romance'];

  // Filter books based on search and filters
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
      const matchesStatus = selectedStatus === 'all' || book.status === selectedStatus;
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [books, searchQuery, selectedGenre, selectedStatus]);

  // Debug function to check modal state
  const handleAddBookClick = () => {
    console.log('Opening add book modal');
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim() || !formData.isbn.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingBook) {
      // Edit existing book
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...formData }
          : book
      ));
      addActivity('system', `Book '${formData.title}' updated successfully`);
      setShowEditModal(false);
    } else {
      // Add new book
      const newBook = {
        id: Date.now(),
        ...formData,
        addedDate: new Date().toISOString().split('T')[0]
      };
      setBooks(prev => [...prev, newBook]);
      addActivity('system', `New book '${formData.title}' added to library`);
      setShowAddModal(false);
    }
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      genre: '',
      isbn: '',
      status: 'available'
    });
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      isbn: book.isbn,
      status: book.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const book = books.find(b => b.id === bookId);
      setBooks(prev => prev.filter(book => book.id !== bookId));
      addActivity('system', `Book '${book.title}' removed from library`);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      available: 'bg-success/10 text-success border border-success/20',
      borrowed: 'bg-warning/10 text-warning border border-warning/20',
      overdue: 'bg-danger/10 text-danger border border-danger/20'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const Modal = ({ title, onClose, children }) => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-dark-border rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary font-poppins">Books Management</h1>
          <p className="text-text-secondary mt-1">Manage your library's book collection</p>
        </div>
        <button
          onClick={handleAddBookClick}
          className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-text-secondary" />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          >
            <option value="all">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>

        <div className="text-sm text-text-secondary">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-accent-blue/30 transition-all-smooth">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-purple rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              {getStatusBadge(book.status)}
            </div>
            
            <h4 className="font-semibold text-text-primary mb-1 line-clamp-2">{book.title}</h4>
            <p className="text-sm text-text-secondary mb-2">by {book.author}</p>
            
            <div className="space-y-1 text-xs text-text-secondary mb-3">
              <p>Genre: {book.genre}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Added: {book.addedDate}</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(book)}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-xs">Edit</span>
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="flex-1 flex items-center justify-center space-x-1 px-2 py-1 bg-danger/10 text-danger hover:bg-danger/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-xs">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <Modal
          title="Add New Book"
          onClose={() => setShowAddModal(false)}
        >
          <BookForm
            onSubmit={(formData) => {
              console.log('BookForm onSubmit - Before adding book:', { isAuthenticated, user });
              console.log('BookForm onSubmit - Form data:', formData);
              
              const newBook = {
                id: Date.now(),
                ...formData,
                addedDate: new Date().toISOString().split('T')[0]
              };
              
              console.log('BookForm onSubmit - About to setBooks');
              setBooks(prev => {
                console.log('BookForm onSubmit - setBooks callback, prev length:', prev.length);
                return [...prev, newBook];
              });
              
              console.log('BookForm onSubmit - About to addActivity');
              addActivity('system', `New book '${formData.title}' added to library`);
              
              console.log('BookForm onSubmit - About to close modal');
              setShowAddModal(false);
              
              console.log('BookForm onSubmit - After all operations:', { isAuthenticated, user });
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <Modal
          title="Edit Book"
          onClose={() => setShowEditModal(false)}
        >
          <BookForm
            initialData={editingBook}
            isEdit={true}
            onSubmit={(formData) => {
              setBooks(prev => prev.map(book => 
                book.id === editingBook.id 
                  ? { ...book, ...formData }
                  : book
              ));
              addActivity('system', `Book '${formData.title}' updated successfully`);
              setShowEditModal(false);
              setEditingBook(null);
            }}
            onCancel={() => {
              setShowEditModal(false);
              setEditingBook(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default BooksManagement;
