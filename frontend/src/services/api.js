const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    const message = error.detail || error.message || 'Request failed';
    throw new Error(message);
  }
  return response.json();
}

export const api = {
  // Campaigns
  getCampaigns: () => request('/campaigns'),
  createCampaign: (data) =>
    request('/campaign', { method: 'POST', body: JSON.stringify(data) }),

  // Posts
  generatePost: (data) =>
    request('/generate-post', { method: 'POST', body: JSON.stringify(data) }),
  createPost: (data) =>
    request('/post', { method: 'POST', body: JSON.stringify(data) }),
  getPosts: () => request('/posts'),
  publishPost: (data) =>
    request('/publish-post', { method: 'POST', body: JSON.stringify(data) }),

  // LinkedIn (simulated)
  publishLinkedin: (data) =>
    request('/publish/linkedin', { method: 'POST', body: JSON.stringify(data) }),
  getLinkedinFeed: () => request('/feed/linkedin'),

  // Scheduler
  schedulePost: (data) =>
    request('/schedule-post', { method: 'POST', body: JSON.stringify(data) }),

  // Analytics
  getAnalytics: (campaignId) => request(`/analytics/${campaignId}`),

  // Metrics
  saveMetrics: (data) =>
    request('/metrics', { method: 'POST', body: JSON.stringify(data) }),
};
