import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getCampaigns()
      .then((data) => {
        if (!isMounted) return;
        const mapped = (data.campaigns || []).map((c) => ({
          id: c.id,
          name: c.campaign_name,
          goal: c.goal,
          platform: c.platform,
          postsCount: c.posts_count || 0,
          status: c.status || 'Active',
          engagement: c.engagement || '-',
        }));
        setCampaigns(mapped);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load campaigns.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (campaign) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== campaign.id));
  };

  const handleToggleStatus = (campaign) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id
          ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' }
          : c
      )
    );
  };

  const handleViewAnalytics = (campaign) => {
    navigate('/analytics', { state: { campaignId: campaign?.id } });
  };

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchStatus = filter === 'All' || c.status === filter;
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [campaigns, filter, search]);

  const statusCounts = {
    All: campaigns.length,
    Active: campaigns.filter((c) => c.status === 'Active').length,
    Paused: campaigns.filter((c) => c.status === 'Paused').length,
    Completed: campaigns.filter((c) => c.status === 'Completed').length,
    Draft: campaigns.filter((c) => c.status === 'Draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">All Campaigns</h2>
          <p className="text-sm text-gray-500">{campaigns.length} total campaigns</p>
        </div>
        <button
          onClick={() => navigate('/create-campaign')}
          className="btn-primary text-sm flex items-center gap-2 self-start"
        >
          <PlusCircle size={15} />
          New Campaign
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-8 py-2 text-sm"
          />
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <Filter size={14} className="text-gray-400" />
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === status
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === status ? 'bg-indigo-500' : 'bg-gray-100 text-gray-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Loading campaigns...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No campaigns found</p>
          <p className="text-sm mt-1">Try a different filter or create a new one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onViewAnalytics={handleViewAnalytics}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
