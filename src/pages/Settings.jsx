import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Instagram,
  Twitter,
  Linkedin,
  Key,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  User,
  Bell,
  Shield,
} from 'lucide-react';

const socialAccounts = [
  { platform: 'Instagram', icon: Instagram, color: 'text-pink-500 bg-pink-50 border-pink-100', connected: true, handle: '@radhika_official' },
  { platform: 'Twitter / X', icon: Twitter, color: 'text-sky-500 bg-sky-50 border-sky-100', connected: true, handle: '@radhika_dev' },
  { platform: 'LinkedIn', icon: Linkedin, color: 'text-blue-600 bg-blue-50 border-blue-100', connected: false, handle: null },
];

export default function Settings() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState(socialAccounts);
  const [apiKey, setApiKey] = useState('sk-••••••••••••••••••••••••');
  const [showKey, setShowKey] = useState(false);
  const [savedKey, setSavedKey] = useState(false);
  const [profile, setProfile] = useState({ name: 'Radhika', email: 'radhikasvarma2006@gmail.com' });
  const [notifications, setNotifications] = useState({
    email: true,
    scheduledPosts: true,
    analytics: false,
    campaignUpdates: true,
  });

  const toggleConnection = (platform) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform ? { ...a, connected: !a.connected } : a
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSaveApiKey = () => {
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <User size={18} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="input-field"
            />
          </div>
        </div>
        <button className="btn-primary mt-4 text-sm">Save Profile</button>
      </div>

      {/* Social Media Accounts */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Shield size={18} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Connected Accounts</h3>
        </div>
        <div className="space-y-3">
          {accounts.map(({ platform, icon: Icon, color, connected, handle }) => (
            <div
              key={platform}
              className={`flex items-center justify-between p-4 rounded-xl border ${color}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{platform}</p>
                  {connected && handle && (
                    <p className="text-xs text-gray-500">{handle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {connected ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={13} /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <AlertCircle size={13} /> Not connected
                  </span>
                )}
                <button
                  onClick={() => toggleConnection(platform)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    connected
                      ? 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100'
                      : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Key size={18} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">API Key</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Use this key to connect your external tools and integrations.
        </p>
        <div className="flex gap-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="input-field font-mono text-sm flex-1"
          />
          <button
            onClick={() => setShowKey((s) => !s)}
            className="btn-secondary px-3 text-xs"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button onClick={handleSaveApiKey} className="btn-primary text-sm">
            Save Key
          </button>
          {savedKey && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 size={13} /> Saved!
            </span>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell size={18} className="text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, enabled]) => {
            const labels = {
              email: 'Email notifications',
              scheduledPosts: 'Scheduled post reminders',
              analytics: 'Weekly analytics digest',
              campaignUpdates: 'Campaign status updates',
            };
            return (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{labels[key]}</span>
                <button
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${enabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Sign Out</h3>
            <p className="text-xs text-gray-400 mt-0.5">Sign out of your SocialAI account</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 btn-danger text-sm"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
