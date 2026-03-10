import { Briefcase, CalendarClock, TrendingUp, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCards from '../components/DashboardCards';
import { EngagementLineChart } from '../components/AnalyticsCharts';

const stats = [
  {
    title: 'Total Campaigns',
    value: '12',
    subtitle: '4 active right now',
    icon: Briefcase,
    color: 'indigo',
    trend: 'up',
    trendValue: '+3 this month',
  },
  {
    title: 'Posts Scheduled',
    value: '48',
    subtitle: 'Next post in 2 hours',
    icon: CalendarClock,
    color: 'violet',
    trend: 'up',
    trendValue: '+12 this week',
  },
  {
    title: 'Avg. Engagement Rate',
    value: '6.8%',
    subtitle: 'Across all platforms',
    icon: TrendingUp,
    color: 'green',
    trend: 'up',
    trendValue: '+1.2% increase',
  },
  {
    title: 'Best Performing Post',
    value: '2.4K',
    subtitle: 'Likes on LinkedIn post',
    icon: Star,
    color: 'orange',
    trend: 'up',
    trendValue: 'Top 5% of posts',
  },
];

const recentActivity = [
  { action: 'Campaign "Summer Launch" created', time: '2 min ago', type: 'create' },
  { action: '5 posts generated for Instagram', time: '15 min ago', type: 'posts' },
  { action: 'Post scheduled for LinkedIn at 6 PM', time: '1 hour ago', type: 'schedule' },
  { action: 'Analytics report generated', time: '3 hours ago', type: 'analytics' },
  { action: '"Product Launch" campaign paused', time: '5 hours ago', type: 'pause' },
];

const topPosts = [
  { platform: 'LinkedIn', text: 'Excited to announce our new product launch! 🚀', likes: 2400, comments: 156 },
  { platform: 'Instagram', text: 'Summer vibes are here! Check out our latest collection ☀️', likes: 1890, comments: 201 },
  { platform: 'Twitter', text: 'Big news coming this week. Stay tuned! 👀', likes: 1240, comments: 89 },
];

const activityColors = {
  create: 'bg-indigo-100 text-indigo-600',
  posts: 'bg-purple-100 text-purple-600',
  schedule: 'bg-green-100 text-green-600',
  analytics: 'bg-blue-100 text-blue-600',
  pause: 'bg-yellow-100 text-yellow-600',
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <DashboardCards stats={stats} />

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Engagement Overview</h3>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 outline-none">
              <option>Last 7 weeks</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <EngagementLineChart />
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityColors[item.type]}`} />
                <div>
                  <p className="text-xs text-gray-700">{item.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top Performing Posts + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'}`}>
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-0.5">{post.platform}</p>
                  <p className="text-sm text-gray-700 truncate">{post.text}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{post.likes.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">likes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/create-campaign')}
              className="btn-primary w-full text-sm"
            >
              + Create New Campaign
            </button>
            <button
              onClick={() => navigate('/scheduler')}
              className="btn-secondary w-full text-sm"
            >
              Schedule a Post
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="btn-secondary w-full text-sm"
            >
              View Analytics
            </button>
            <button
              onClick={() => navigate('/generated-posts')}
              className="btn-secondary w-full text-sm"
            >
              Review Generated Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
