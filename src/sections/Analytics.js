import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  DollarSign, 
  Calendar,
  Award,
  AlertTriangle,
  Target
} from 'lucide-react';

const Analytics = () => {
  const { books, users, borrowRecords } = useContext(AppContext);

  const getGenreColor = (genre) => {
    const colors = {
      'Programming': '#3b82f6',
      'Self-Help': '#8b5cf6',
      'Business': '#10b981',
      'Finance': '#f59e0b',
      'Psychology': '#ef4444',
      'Fiction': '#06b6d4',
      'History': '#84cc16',
      'Science': '#f97316',
      'Romance': '#ec4899'
    };
    return colors[genre] || '#6b7280';
  };

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    // Most borrowed books
    const bookBorrowCounts = borrowRecords.reduce((acc, record) => {
      acc[record.bookTitle] = (acc[record.bookTitle] || 0) + 1;
      return acc;
    }, {});
    
    const mostBorrowedBooks = Object.entries(bookBorrowCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));

    // Most active users
    const userBorrowCounts = borrowRecords.reduce((acc, record) => {
      acc[record.userName] = (acc[record.userName] || 0) + 1;
      return acc;
    }, {});
    
    const mostActiveUsers = Object.entries(userBorrowCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Genre distribution
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
    
    const genreDistribution = Object.entries(genreCounts).map(([genre, count]) => ({
      name: genre,
      value: count,
      color: getGenreColor(genre)
    }));

    // Monthly borrowing trends
    const monthlyData = [
      { month: 'Jan', borrowed: 45, returned: 42, overdue: 3 },
      { month: 'Feb', borrowed: 52, returned: 48, overdue: 4 },
      { month: 'Mar', borrowed: 48, returned: 45, overdue: 3 },
      { month: 'Apr', borrowed: 61, returned: 55, overdue: 6 },
      { month: 'May', borrowed: 55, returned: 52, overdue: 3 },
      { month: 'Jun', borrowed: 67, returned: 60, overdue: 7 }
    ];

    // Overdue trends
    const overdueTrends = [
      { month: 'Jan', overdue: 3, lateFees: 150 },
      { month: 'Feb', overdue: 4, lateFees: 200 },
      { month: 'Mar', overdue: 3, lateFees: 180 },
      { month: 'Apr', overdue: 6, lateFees: 450 },
      { month: 'May', overdue: 3, lateFees: 220 },
      { month: 'Jun', overdue: 7, lateFees: 520 }
    ];

    // Key metrics
    const totalBorrows = borrowRecords.length;
    const activeUsers = users.filter(user => user.booksBorrowed > 0).length;
    const totalLateFees = borrowRecords.reduce((sum, record) => sum + (record.lateFee || 0), 0);
    const overdueBooks = borrowRecords.filter(record => record.status === 'overdue').length;
    const avgBorrowsPerUser = totalBorrows / users.length;

    return {
      mostBorrowedBooks,
      mostActiveUsers,
      genreDistribution,
      monthlyData,
      overdueTrends,
      metrics: {
        totalBorrows,
        activeUsers,
        totalLateFees,
        overdueBooks,
        avgBorrowsPerUser
      }
    };
  }, [books, users, borrowRecords]);

  const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/30 transition-all-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>
      <div>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary mt-1">{title}</p>
        {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border rounded-lg p-3">
          <p className="text-sm text-text-primary font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary font-poppins">Analytics</h1>
        <p className="text-text-secondary mt-1">Insights and trends from your library data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Borrows"
          value={analyticsData.metrics.totalBorrows}
          icon={BookOpen}
          color="bg-accent-blue"
          subtitle="All time"
        />
        <MetricCard
          title="Active Users"
          value={analyticsData.metrics.activeUsers}
          icon={Users}
          color="bg-success"
          subtitle={`${users.length} total users`}
        />
        <MetricCard
          title="Late Fees"
          value={`Rs ${analyticsData.metrics.totalLateFees}`}
          icon={DollarSign}
          color="bg-warning"
          subtitle="Collected"
        />
        <MetricCard
          title="Overdue Books"
          value={analyticsData.metrics.overdueBooks}
          icon={AlertTriangle}
          color="bg-danger"
          subtitle="Need attention"
        />
        <MetricCard
          title="Avg Borrows/User"
          value={analyticsData.metrics.avgBorrowsPerUser.toFixed(1)}
          icon={Target}
          color="bg-accent-purple"
          subtitle="Per user"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Borrowing Trends */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Borrowing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={customTooltip} />
              <Area type="monotone" dataKey="borrowed" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="returned" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="overdue" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-blue rounded"></div>
              <span className="text-text-secondary">Borrowed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-text-secondary">Returned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-danger rounded"></div>
              <span className="text-text-secondary">Overdue</span>
            </div>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.genreDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {analyticsData.genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Most Borrowed Books */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-accent-blue" />
            Most Borrowed Books
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.mostBorrowedBooks} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="title" type="category" width={120} stroke="#9ca3af" />
              <Tooltip content={customTooltip} />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Active Users */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-success" />
            Most Active Users
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.mostActiveUsers} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" width={120} stroke="#9ca3af" />
              <Tooltip content={customTooltip} />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Overdue Trends */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-danger" />
          Overdue Trends & Late Fees
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.overdueTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
            <Tooltip content={customTooltip} />
            <Line yAxisId="left" type="monotone" dataKey="overdue" stroke="#ef4444" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="lateFees" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger rounded"></div>
            <span className="text-text-secondary">Overdue Books</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span className="text-text-secondary">Late Fees (Rs)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
