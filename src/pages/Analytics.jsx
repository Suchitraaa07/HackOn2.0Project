import { ThumbsUp, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import AnalyticsCharts, { EngagementLineChart, BestPostingTimeChart } from '../components/AnalyticsCharts';

const metricsData = [
  { label: 'Total Likes', value: '24,381', change: '+12%', color: 'bg-pink-50 text-pink-600', icon: ThumbsUp },
  { label: 'Total Comments', value: '8,204', change: '+8%', color: 'bg-yellow-50 text-yellow-600', icon: MessageCircle },
  { label: 'Total Shares', value: '3,942', change: '+15%', color: 'bg-green-50 text-green-600', icon: Share2 },
  { label: 'Avg. Engagement', value: '6.8%', change: '+1.2%', color: 'bg-indigo-50 text-indigo-600', icon: TrendingUp },
];

const platformBreakdown = [
  { platform: 'Instagram', likes: 12400, comments: 4100, shares: 2100, engagement: '7.2%' },
  { platform: 'LinkedIn', likes: 8200, comments: 2800, shares: 1300, engagement: '6.1%' },
  { platform: 'Twitter', likes: 3781, comments: 1304, shares: 542, engagement: '5.8%' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metricsData.map(({ label, value, change, color, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={15} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{change} this month</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Engagement Over Time</h3>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 outline-none">
              <option>Last 7 weeks</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <EngagementLineChart />
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Best Posting Times</h3>
          <BestPostingTimeChart />
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="card">
        <div className="px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">Platform Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Platform</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Likes</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Comments</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Shares</th>
                <th className="text-right text-xs font-medium text-gray-400 px-5 py-3">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {platformBreakdown.map((row) => (
                <tr key={row.platform} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{row.platform}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{row.likes.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{row.comments.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{row.shares.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right font-semibold text-indigo-600">{row.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
