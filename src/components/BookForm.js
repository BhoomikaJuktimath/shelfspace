import React, { useState } from 'react';

const BookForm = ({ initialData, onSubmit, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    status: 'available',
    ...initialData
  });

  const genres = ['Programming', 'Self-Help', 'Business', 'Finance', 'Psychology', 'Fiction', 'History', 'Science', 'Romance'];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.title.trim() || !formData.author.trim() || !formData.genre.trim() || !formData.isbn.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          placeholder="Enter book title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Author</label>
        <input
          type="text"
          required
          value={formData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          placeholder="Enter author name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">Genre</label>
        <select
          required
          value={formData.genre}
          onChange={(e) => handleChange('genre', e.target.value)}
          className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
        >
          <option value="">Select genre</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">ISBN</label>
        <input
          type="text"
          required
          value={formData.isbn}
          onChange={(e) => handleChange('isbn', e.target.value)}
          className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          placeholder="978-0-000-00000-0"
        />
      </div>
      
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary focus:outline-none focus:border-accent-blue"
          >
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>
      )}
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border text-text-primary hover:bg-dark-border rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-lg transition-colors"
        >
          {isEdit ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </div>
  );
};

export default BookForm;
