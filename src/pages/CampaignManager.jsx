import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { Search, Filter, PlusCircle } from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'Summer Sale 2026', goal: 'Sales & Conversions', platform: 'Instagram', postsCount: 12, status: 'Active', engagement: '7.4%' },
  { id: 2, name: 'Q2 Product Launch', goal: 'Product Launch', platform: 'LinkedIn', postsCount: 8, status: 'Active', engagement: '6.1%' },
  { id: 3, name: 'Community Spotlight', goal: 'Community Engagement', platform: 'Multi', postsCount: 20, status: 'Paused', engagement: '5.8%' },
  { id: 4, name: 'Brand Awareness Q1', goal: 'Brand Awareness', platform: 'Twitter', postsCount: 15, status: 'Completed', engagement: '4.9%' },
  { id: 5, name: 'Flash Sale Weekend', goal: 'Sales & Conversions', platform: 'Instagram', postsCount: 5, status: 'Active', engagement: '8.2%' },
  { id: 6, name: 'Thought Leadership', goal: 'Brand Awareness', platform: 'LinkedIn', postsCount: 10, status: 'Draft', engagement: '—' },
];

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const filtered = campaigns.filter((c) => {
    const matchStatus = filter === 'All' || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
      {filtered.length === 0 ? (
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
