import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Filter, Search } from 'lucide-react';

const DUMMY_POSTS = [
  {
    id: 1,
    platform: 'Instagram',
    text: '☀️ Summer is here and so are the deals! Get 30% off our best-selling collection. Limited time only! Shop now via link in bio.',
    hashtags: '#SummerSale #Fashion #Style #OOTD #ShopNow',
    createdAt: '2 min ago',
  },
  {
    id: 2,
    platform: 'LinkedIn',
    text: "We're proud to announce our Summer 2026 campaign! As businesses evolve, so do we. Discover how our solutions are helping professionals stay ahead of the curve.",
    hashtags: '#Innovation #Business #Summer2026 #Leadership',
    createdAt: '2 min ago',
  },
  {
    id: 3,
    platform: 'Twitter',
    text: 'Big summer sale is LIVE! 🔥 30% off everything. Use code SUMMER30 at checkout. Link below 👇',
    hashtags: '#SummerSale #Deals #Sale',
    createdAt: '2 min ago',
  },
  {
    id: 4,
    platform: 'Instagram',
    text: "New season, new look. 🌊 We've refreshed our entire collection with bold summer vibes. Which one is your favorite?",
    hashtags: '#NewCollection #Summer #Fashion #Trend',
    createdAt: '2 min ago',
  },
  {
    id: 5,
    platform: 'LinkedIn',
    text: 'Q2 results are in and we exceeded our targets by 40%! Huge thanks to our incredible team and loyal customers. Here\'s to a bigger Q3! \uD83D\uDE80',
    hashtags: '#BusinessGrowth #Q2Results #TeamWork',
    createdAt: '2 min ago',
  },
  {
    id: 6,
    platform: 'Twitter',
    text: "Can't believe how fast Q2 flew by! Here's a quick thread on what we learned and where we're headed. 🧵 1/5",
    hashtags: '#StartupLife #GrowthHacking',
    createdAt: '2 min ago',
  },
];

export default function GeneratedPosts() {
  const [posts, setPosts] = useState(DUMMY_POSTS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const campaignName = location.state?.campaign?.name;

  const handleDelete = (post) => {
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  const handleSchedule = (post) => {
    navigate('/scheduler', { state: { post } });
  };

  const handleEdit = (post) => {
    setEditingPost({ ...post });
  };

  const handleSaveEdit = () => {
    setPosts((prev) => prev.map((p) => (p.id === editingPost.id ? editingPost : p)));
    setEditingPost(null);
  };

  const filtered = posts.filter((p) => {
    const matchPlatform = filter === 'All' || p.platform === filter;
    const matchSearch = p.text.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {campaignName ? `Posts for "${campaignName}"` : 'Generated Posts'}
          </h2>
          <p className="text-sm text-gray-500">{posts.length} posts generated</p>
        </div>
        <button
          onClick={() => navigate('/create-campaign')}
          className="btn-primary text-sm self-start sm:self-auto"
        >
          + Generate More
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-8 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {['All', 'Instagram', 'Twitter', 'LinkedIn'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${
                filter === p
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No posts found</p>
          <p className="text-sm mt-1">Try adjusting your filters or generate new posts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onSchedule={handleSchedule}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">Edit Post</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Platform</label>
                <select
                  value={editingPost.platform}
                  onChange={(e) => setEditingPost((p) => ({ ...p, platform: e.target.value }))}
                  className="input-field"
                >
                  {['Instagram', 'Twitter', 'LinkedIn'].map((pl) => (
                    <option key={pl} value={pl}>{pl}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Post Text</label>
                <textarea
                  value={editingPost.text}
                  onChange={(e) => setEditingPost((p) => ({ ...p, text: e.target.value }))}
                  className="input-field resize-none"
                  rows={6}
                />
              </div>
              <div>
                <label className="label">Hashtags</label>
                <input
                  type="text"
                  value={editingPost.hashtags}
                  onChange={(e) => setEditingPost((p) => ({ ...p, hashtags: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveEdit} className="btn-primary flex-1">Save Changes</button>
              <button onClick={() => setEditingPost(null)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
