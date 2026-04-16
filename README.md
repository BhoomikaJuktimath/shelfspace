# ShelfSpace Admin Dashboard

A modern, minimal, dark-themed admin dashboard for an Online Library Management System. This React application provides comprehensive library management capabilities with a professional interface designed for daily use in educational or corporate environments.

## Features

### Core Functionality
- **Dashboard**: Real-time metrics, activity feed, and visual analytics
- **Books Management**: Full CRUD operations for book inventory
- **User Management**: View user details and borrowing history
- **Borrow Records**: Track all borrowing transactions with overdue management
- **Analytics**: Comprehensive insights with interactive charts

### Key Features
- Dark theme with subtle blue/purple accents
- Responsive design for all screen sizes
- Real-time search functionality
- Data persistence using localStorage
- Smooth animations and hover effects
- Preloaded with realistic sample data
- Late fee calculation ($5/day)
- Status indicators and badges

## Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Data Storage**: localStorage (client-side)
- **Typography**: Inter & Poppins fonts

## Project Structure

```
src/
|-- components/
|   |-- Sidebar.js          # Navigation sidebar
|   |-- Navbar.js           # Top navigation bar
|-- sections/
|   |-- Dashboard.js        # Main dashboard with metrics
|   |-- BooksManagement.js  # Book CRUD operations
|   |-- Users.js            # User management
|   |-- BorrowRecords.js    # Borrowing transactions
|   |-- Analytics.js        # Data insights and charts
|-- data/
|   |-- initialData.js      # Preloaded sample data
|-- App.js                  # Main application component
|-- index.css               # Global styles and Tailwind imports
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
```

## Data Management

### Preloaded Data
The application comes with realistic sample data:
- **30 Books**: Various genres including Programming, Self-Help, Business, etc.
- **10 Users**: Active library members with borrowing history
- **15+ Borrow Records**: Mix of active, returned, and overdue transactions
- **20+ Activity Logs**: Recent system activities

### Data Persistence
All data is automatically saved to localStorage:
- Books inventory
- User information
- Borrow records
- Activity logs

## Features in Detail

### Dashboard
- Key metrics cards with trend indicators
- Recent activity feed
- Interactive charts (borrowing trends, genre distribution)
- Real-time data updates

### Books Management
- Add new books with form validation
- Edit existing book details
- Delete books with confirmation
- Search and filter by genre/status
- Card-based layout for easy scanning

### User Management
- User cards with borrowing statistics
- Detailed user profiles with full history
- Overdue book indicators
- Contact information display

### Borrow Records
- Comprehensive transaction tracking
- Overdue book highlighting
- Late fee calculation
- Mark books as returned
- Sort and filter capabilities

### Analytics
- Most borrowed books chart
- Most active users ranking
- Genre distribution visualization
- Monthly borrowing trends
- Overdue trends analysis

## Design System

### Color Palette
- **Background**: #0a0a0a (deep black)
- **Cards**: #111111 (charcoal)
- **Borders**: #1a1a1a (dark gray)
- **Primary**: #3b82f6 (blue)
- **Secondary**: #8b5cf6 (purple)
- **Success**: #10b981 (green)
- **Warning**: #f59e0b (amber)
- **Danger**: #ef4444 (red)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Poppins (for headings)
- **Weights**: 300, 400, 500, 600, 700

### Animations
- Smooth transitions (0.3s cubic-bezier)
- Hover effects on interactive elements
- Fade-in animations for modals
- Slide-in animations for cards

## Usage

1. **Navigation**: Use the sidebar to switch between sections
2. **Search**: Use the top navbar search to find books, users, or records
3. **Books Management**: Add, edit, or delete books from the Books section
4. **User Details**: Click on any user card to view detailed information
5. **Borrow Management**: Track and manage borrowing transactions
6. **Analytics**: View insights and trends in the Analytics section

## Future Enhancements

- User authentication system
- Email notifications for overdue books
- Advanced reporting features
- Export functionality (PDF, Excel)
- Multi-language support
- Real-time updates with WebSocket
- Backend API integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with React and Tailwind CSS
- Icons by Lucide React
- Charts by Recharts
- Fonts by Google Fonts
