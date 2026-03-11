import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function LinkedinFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await api.getLinkedinFeed();
      setPosts(Array.isArray(data) ? data : []);
      setError('');
    } catch {
      setError('Failed to load LinkedIn feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);
    
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">LinkedIn Feed</h2>
        <button onClick={loadFeed} className="btn-secondary text-sm">Refresh</button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No LinkedIn posts yet.</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div key={post.id || index} className="card p-5">
              <div className="text-xs text-gray-400 mb-2">
                Posted via AI Social Marketing Tool
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-line">{post.content}</p>
              <div className="text-xs text-gray-400 mt-3">
                {post.published_at || post.created_at || 'Just now'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
