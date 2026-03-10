import { useState } from 'react';
import { CalendarClock, CheckCircle2, Instagram, Twitter, Linkedin, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DUMMY_POSTS = [
  { id: 1, text: '☀️ Summer sale is LIVE! 30% off everything.', platform: 'Instagram' },
  { id: 2, text: 'Exciting Q2 results — we exceeded targets by 40%!', platform: 'LinkedIn' },
  { id: 3, text: 'Big news coming this week. Stay tuned! 👀', platform: 'Twitter' },
  { id: 4, text: 'New collection drop this Friday. Be ready!', platform: 'Instagram' },
];

const SCHEDULED = [
  { id: 1, text: 'Product launch announcement!', platform: 'LinkedIn', date: '2026-03-11', time: '09:00', status: 'Scheduled' },
  { id: 2, text: 'Weekend offer — 20% off for 48 hours!', platform: 'Instagram', date: '2026-03-12', time: '18:00', status: 'Scheduled' },
  { id: 3, text: 'Thank you for 10K followers!', platform: 'Twitter', date: '2026-03-10', time: '12:00', status: 'Published' },
];

const platformIcon = { Instagram, Twitter, LinkedIn: Linkedin };
const platformColors = {
  Instagram: 'text-pink-500',
  Twitter: 'text-sky-500',
  LinkedIn: 'text-blue-600',
};

export default function Scheduler() {
  const location = useLocation();
  const preselectedPost = location.state?.post;

  const [form, setForm] = useState({
    postId: preselectedPost?.id || '',
    date: '',
    time: '',
    platform: preselectedPost?.platform || '',
  });
  const [scheduled, setScheduled] = useState(SCHEDULED);
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.postId || !form.date || !form.time || !form.platform) return;

    const post = DUMMY_POSTS.find((p) => p.id === Number(form.postId));
    setScheduled((prev) => [
      {
        id: Date.now(),
        text: post?.text || 'Custom post',
        platform: form.platform,
        date: form.date,
        time: form.time,
        status: 'Scheduled',
      },
      ...prev,
    ]);
    setSuccess(true);
    setForm({ postId: '', date: '', time: '', platform: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scheduler Form */}
        <div className="card p-6 xl:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
              <CalendarClock size={18} className="text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Schedule a Post</h3>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700">
              <CheckCircle2 size={15} />
              Post scheduled successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Select Post *</label>
              <select
                value={form.postId}
                onChange={(e) => handleChange('postId', e.target.value)}
                className="input-field"
              >
                <option value="">Choose a post...</option>
                {DUMMY_POSTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.platform}] {p.text.slice(0, 50)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Platform *</label>
              <select
                value={form.platform}
                onChange={(e) => handleChange('platform', e.target.value)}
                className="input-field"
              >
                <option value="">Select platform...</option>
                {['Instagram', 'Twitter', 'LinkedIn'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleChange('date', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Clock size={16} />
              Schedule Post
            </button>
          </form>
        </div>

        {/* Scheduled Queue */}
        <div className="card xl:col-span-2">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Scheduled Queue</h3>
            <p className="text-xs text-gray-400 mt-0.5">{scheduled.filter(s => s.status === 'Scheduled').length} posts pending</p>
          </div>
          <div className="divide-y divide-gray-50">
            {scheduled.map((item) => {
              const Icon = platformIcon[item.platform] || Instagram;
              return (
                <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center ${platformColors[item.platform]}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.platform} · {item.date} at {item.time}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    item.status === 'Published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
