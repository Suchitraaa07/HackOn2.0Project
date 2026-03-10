const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export const api = {
  // Auth
  login: (credentials) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (data) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  // Campaigns
  getCampaigns: () => request('/campaigns'),
  createCampaign: (data) =>
    request('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  deleteCampaign: (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),
  updateCampaign: (id, data) =>
    request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Posts
  generatePosts: (data) =>
    request('/generate-posts', { method: 'POST', body: JSON.stringify(data) }),
  getPosts: () => request('/posts'),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  updatePost: (id, data) =>
    request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Scheduler
  schedulePost: (data) =>
    request('/schedule', { method: 'POST', body: JSON.stringify(data) }),
  getScheduled: () => request('/schedule'),

  // Analytics
  getAnalytics: (campaignId) =>
    request(`/analytics${campaignId ? `?campaignId=${campaignId}` : ''}`),
};
