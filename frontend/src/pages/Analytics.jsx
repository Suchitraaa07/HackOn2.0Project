import { useEffect, useMemo, useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { EngagementLineChart, BestPostingTimeChart } from '../components/AnalyticsCharts';
import { api } from '../services/api';

export default function Analytics() {
  const location = useLocation();
  const presetCampaignId = location.state?.campaignId;

  const [campaigns, setCampaigns] = useState([]);
  const [campaignId, setCampaignId] = useState(presetCampaignId || '');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getCampaigns()
      .then((data) => {
        if (!isMounted) return;
        const list = data.campaigns || [];
        setCampaigns(list);
        if (!campaignId && list[0]?.id) {
          setCampaignId(list[0].id);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load campaigns.');
      });

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  useEffect(() => {
    if (!campaignId) return;
    let isMounted = true;
    setLoading(true);
    api.getAnalytics(campaignId)
      .then((data) => {
        if (!isMounted) return;
        setSummary(data);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load analytics.');
        setSummary(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  const metricsData = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'Total Likes', value: summary.total_likes.toLocaleString(), change: '-', color: 'bg-pink-50 text-pink-600', icon: ThumbsUp },
      { label: 'Total Comments', value: summary.total_comments.toLocaleString(), change: '-', color: 'bg-yellow-50 text-yellow-600', icon: MessageCircle },
      { label: 'Total Shares', value: summary.total_shares.toLocaleString(), change: '-', color: 'bg-green-50 text-green-600', icon: Share2 },
      { label: 'Engagement Rate', value: `${(summary.engagement_rate * 100).toFixed(2)}%`, change: '-', color: 'bg-indigo-50 text-indigo-600', icon: TrendingUp },
    ];
  }, [summary]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Campaign</label>
        <select
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Select a campaign...</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>{c.campaign_name}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {metricsData.length === 0 && !loading ? (
          <div className="text-sm text-gray-400">No analytics available.</div>
        ) : metricsData.map(({ label, value, change, color, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={15} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{change}</p>
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
        <div className="p-5 text-sm text-gray-400">
          Detailed platform analytics will appear here once available.
        </div>
      </div>
    </div>
  );
}
