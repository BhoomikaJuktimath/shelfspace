import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { books, users, borrowRecords, activities } = useContext(AppContext);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalBooks = books.length;
    const availableBooks = books.filter(book => book.status === 'available').length;
    const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
    const overdueBooks = borrowRecords.filter(record => record.status === 'overdue').length;
    const activeUsers = users.filter(user => user.booksBorrowed > 0).length;

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      activeUsers
    };
  }, [books, users, borrowRecords]);

  // Mock data for charts
  const borrowingTrendData = [
    { month: 'Jan', borrowed: 45 },
    { month: 'Feb', borrowed: 52 },
    { month: 'Mar', borrowed: 48 },
    { month: 'Apr', borrowed: 61 },
    { month: 'May', borrowed: 55 },
    { month: 'Jun', borrowed: 67 }
  ];

  const genreData = [
    { name: 'Programming', value: 8, color: '#3b82f6' },
    { name: 'Self-Help', value: 6, color: '#8b5cf6' },
    { name: 'Business', value: 5, color: '#10b981' },
    { name: 'Finance', value: 4, color: '#f59e0b' },
    { name: 'Psychology', value: 3, color: '#ef4444' },
    { name: 'Fiction', value: 2, color: '#06b6d4' },
    { name: 'History', value: 1, color: '#84cc16' },
    { name: 'Science', value: 1, color: '#f97316' }
  ];

  const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-accent-blue/30 transition-all-smooth animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${trend > 0 ? 'text-success' : 'text-danger'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'borrow':
          return <BookOpen className="w-4 h-4 text-accent-blue" />;
        case 'return':
          return <BookOpen className="w-4 h-4 text-success" />;
        case 'system':
          return <Activity className="w-4 h-4 text-warning" />;
        default:
          return <Activity className="w-4 h-4 text-text-secondary" />;
      }
    };

    const getActivityColor = (type) => {
      switch (type) {
        case 'borrow':
          return 'bg-accent-blue/10 text-accent-blue';
        case 'return':
          return 'bg-success/10 text-success';
        case 'system':
          return 'bg-warning/10 text-warning';
        default:
          return 'bg-dark-border text-text-secondary';
      }
    };

    const date = new Date(activity.timestamp);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-dark-bg rounded-lg transition-all-smooth">
        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-primary">{activity.description}</p>
          <p className="text-xs text-text-secondary mt-1">{formattedDate}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary font-poppins">Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's what's happening in your library today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Books"
          value={metrics.totalBooks}
          icon={BookOpen}
          color="bg-accent-blue"
          trend={12}
        />
        <MetricCard
          title="Available"
          value={metrics.availableBooks}
          icon={BookOpen}
          color="bg-success"
          trend={8}
        />
        <MetricCard
          title="Borrowed"
          value={metrics.borrowedBooks}
          icon={BookOpen}
          color="bg-warning"
          trend={-5}
        />
        <MetricCard
          title="Overdue"
          value={metrics.overdueBooks}
          icon={AlertTriangle}
          color="bg-danger"
          trend={15}
        />
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          icon={Users}
          color="bg-accent-purple"
          trend={6}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Borrowing Trend */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Books Borrowed Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={borrowingTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  border: '1px solid #1a1a1a',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
              <Line 
                type="monotone" 
                dataKey="borrowed" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Distribution */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  border: '1px solid #1a1a1a',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#ffffff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {genreData.slice(0, 4).map((genre) => (
              <div key={genre.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: genre.color }}></div>
                  <span className="text-text-secondary">{genre.name}</span>
                </div>
                <span className="text-text-primary font-medium">{genre.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <button className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {activities.slice(0, 10).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
