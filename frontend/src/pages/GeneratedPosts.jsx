import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Filter, Search } from 'lucide-react';
import { api } from '../services/api';

function mapApiPost(post) {
  return {
    id: post.id,
    platform: post.platform,
    text: post.content,
    hashtags: '',
    createdAt: post.created_at || 'Just now',
    status: post.status || 'draft',
    campaignId: post.campaign_id,
  };
}

const publishStages = [
  'Publishing to LinkedIn...',
  'Connecting...',
  'Posting...',
  'Success.',
];

export default function GeneratedPosts() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPosts = location.state?.posts || [];
  const campaignId = location.state?.campaign?.id || initialPosts[0]?.campaignId;

  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publishStatus, setPublishStatus] = useState('');
  const [publishingId, setPublishingId] = useState(null);
  const timeoutRef = useRef([]);

  const campaignName = location.state?.campaign?.name;

  useEffect(() => {
    if (initialPosts.length > 0) return;
    let isMounted = true;

    setLoading(true);
    api.getPosts()
      .then((data) => {
        if (!isMounted) return;
        const mapped = (data.posts || []).map(mapApiPost);
        setPosts(mapped);
        setError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Failed to load posts.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialPosts.length]);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((t) => clearTimeout(t));
      timeoutRef.current = [];
    };
  }, []);

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

  const handlePublishLinkedin = async (post) => {
    if (!campaignId) {
      setError('Missing campaign id for publishing.');
      return;
    }

    setPublishingId(post.id);
    setError('');
    setPublishStatus(publishStages[0]);

    timeoutRef.current.push(setTimeout(() => setPublishStatus(publishStages[1]), 400));
    timeoutRef.current.push(setTimeout(() => setPublishStatus(publishStages[2]), 900));

    try {
      await api.publishLinkedin({ content: post.text, campaign_id: campaignId });
      setPublishStatus(publishStages[3]);
      await api.getLinkedinFeed();
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: 'published' } : p)));
      timeoutRef.current.push(setTimeout(() => setPublishStatus(''), 2000));
    } catch {
      setError('Failed to publish to LinkedIn.');
      setPublishStatus('');
    } finally {
      setPublishingId(null);
    }
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchPlatform = filter === 'All' || p.platform === filter;
      const matchSearch = p.text.toLowerCase().includes(search.toLowerCase());
      return matchPlatform && matchSearch;
    });
  }, [filter, posts, search]);

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

      {publishStatus && (
        <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
          {publishStatus}
        </div>
      )}

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

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Loading posts...</p>
        </div>
      ) : filtered.length === 0 ? (
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
              onPublishLinkedin={post.id === publishingId ? null : handlePublishLinkedin}
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
