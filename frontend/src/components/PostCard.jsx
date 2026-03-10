import { Instagram, Twitter, Linkedin, Edit3, Calendar, Trash2 } from 'lucide-react';

const PlatformIcon = ({ platform }) => {
  const map = {
    Instagram: { icon: Instagram, color: 'text-pink-500 bg-pink-50' },
    Twitter: { icon: Twitter, color: 'text-sky-500 bg-sky-50' },
    LinkedIn: { icon: Linkedin, color: 'text-blue-600 bg-blue-50' },
  };
  const entry = map[platform] || { icon: Instagram, color: 'text-gray-500 bg-gray-50' };
  const Icon = entry.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${entry.color}`}>
      <Icon size={12} />
      {platform}
    </span>
  );
};

export default function PostCard({ post, onEdit, onSchedule, onDelete }) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <PlatformIcon platform={post.platform} />
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {post.createdAt || 'Just now'}
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed flex-1">{post.text}</p>
      {post.hashtags && (
        <p className="text-xs text-indigo-500 font-medium">{post.hashtags}</p>
      )}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
        <button
          onClick={() => onEdit && onEdit(post)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Edit3 size={13} /> Edit
        </button>
        <button
          onClick={() => onSchedule && onSchedule(post)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-indigo-600 transition-colors ml-2"
        >
          <Calendar size={13} /> Schedule
        </button>
        <button
          onClick={() => onDelete && onDelete(post)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-500 transition-colors ml-auto"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
