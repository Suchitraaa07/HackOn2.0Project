import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Instagram, Twitter, Linkedin, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const PLATFORMS = [
  { id: 'Instagram', icon: Instagram, color: 'border-pink-200 bg-pink-50 text-pink-600' },
  { id: 'Twitter', icon: Twitter, color: 'border-sky-200 bg-sky-50 text-sky-600' },
  { id: 'LinkedIn', icon: Linkedin, color: 'border-blue-200 bg-blue-50 text-blue-600' },
];

const TONES = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational'];
const GOALS = [
  'Brand Awareness',
  'Lead Generation',
  'Product Launch',
  'Community Engagement',
  'Event Promotion',
  'Sales & Conversions',
];

const defaultForm = {
  name: '',
  goal: '',
  audience: '',
  platforms: [],
  tone: '',
  postsCount: 5,
};

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const togglePlatform = (platform) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.goal || !form.audience || form.platforms.length === 0 || !form.tone) {
      setError('Please fill in all required fields and select at least one platform.');
      return;
    }

    setLoading(true);
    try {
      const primaryPlatform = form.platforms[0];
      const campaignPayload = {
        campaign_name: form.name,
        platform: primaryPlatform,
        audience: form.audience,
        goal: form.goal,
        tone: form.tone,
      };

      const campaignResponse = await api.createCampaign(campaignPayload);
      const campaignRecord = Array.isArray(campaignResponse.data)
        ? campaignResponse.data[0]
        : campaignResponse.data;
      const campaignId = campaignRecord?.id;

      if (!campaignId) {
        throw new Error('Campaign could not be created.');
      }

      const generated = await Promise.all(
        form.platforms.map((platform) =>
          api.generatePost({
            ...campaignPayload,
            campaign_id: campaignId,
            campaign_name: form.name,
            platform,
          })
        )
      );

      const nowLabel = new Date().toLocaleString();
      const posts = generated.map((result, index) => {
        const saved = Array.isArray(result.saved_post) ? result.saved_post[0] : result.saved_post;
        const platform = form.platforms[index];
        return {
          id: saved?.id || `${campaignId}-${index + 1}`,
          platform: saved?.platform || platform,
          text: result.generated_post,
          hashtags: '',
          createdAt: nowLabel,
          status: saved?.status || 'draft',
        };
      });

      navigate('/generated-posts', {
        state: { campaign: { ...form, id: campaignId }, posts },
      });
    } catch {
      setError('Failed to generate or publish posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">New Campaign</h2>
            <p className="text-sm text-gray-500">Fill in the details to generate AI-powered posts</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="label">Campaign Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Summer Sale 2026"
              className="input-field"
            />
          </div>

          {/* Goal */}
          <div>
            <label className="label">Campaign Goal *</label>
            <select
              value={form.goal}
              onChange={(e) => handleChange('goal', e.target.value)}
              className="input-field"
            >
              <option value="">Select a goal...</option>
              {GOALS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="label">Target Audience *</label>
            <textarea
              value={form.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
              placeholder="e.g. Young professionals aged 25-35, interested in tech and productivity"
              className="input-field resize-none"
              rows={3}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="label">Platform *</label>
            <div className="flex gap-3">
              {PLATFORMS.map(({ id, icon: Icon, color }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePlatform(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-150 ${
                    form.platforms.includes(id)
                      ? color + ' ring-2 ring-indigo-400 ring-offset-1'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={15} />
                  {id}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="label">Tone *</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleChange('tone', t)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                    form.tone === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Posts */}
          <div>
            <label className="label">Number of Posts: <span className="font-bold text-indigo-600">{form.postsCount}</span></label>
            <input
              type="range"
              min={1}
              max={20}
              value={form.postsCount}
              onChange={(e) => handleChange('postsCount', Number(e.target.value))}
              className="w-full h-2 accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span><span>20</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating Posts...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Posts
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
