import { BarChart2, Trash2, Eye, Pause, Play } from 'lucide-react';

const statusStyles = {
  Active: 'bg-green-50 text-green-700 border-green-100',
  Paused: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  Completed: 'bg-gray-50 text-gray-600 border-gray-100',
  Draft: 'bg-blue-50 text-blue-700 border-blue-100',
};

export default function CampaignCard({ campaign, onViewAnalytics, onDelete, onToggleStatus }) {
  const status = campaign.status || 'Draft';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{campaign.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{campaign.goal || 'Brand Awareness'}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyles[status] || statusStyles.Draft}`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{campaign.postsCount || 0}</p>
          <p className="text-xs text-gray-400">Posts</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-lg font-bold text-gray-900">{campaign.platform || 'Multi'}</p>
          <p className="text-xs text-gray-400">Platform</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{campaign.engagement || '—'}</p>
          <p className="text-xs text-gray-400">Engagement</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
        <button
          onClick={() => onViewAnalytics && onViewAnalytics(campaign)}
          className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <BarChart2 size={13} /> Analytics
        </button>
        <button
          onClick={() => onToggleStatus && onToggleStatus(campaign)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors ml-2"
        >
          {status === 'Active' ? <Pause size={13} /> : <Play size={13} />}
          {status === 'Active' ? 'Pause' : 'Activate'}
        </button>
        <button
          onClick={() => onDelete && onDelete(campaign)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors ml-auto"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
