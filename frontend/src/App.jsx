import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import GeneratedPosts from './pages/GeneratedPosts';
import Scheduler from './pages/Scheduler';
import Analytics from './pages/Analytics';
import CampaignManager from './pages/CampaignManager';
import Settings from './pages/Settings';
import LinkedinFeed from './pages/LinkedinFeed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-campaign" element={<CreateCampaign />} />
          <Route path="generated-posts" element={<GeneratedPosts />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="campaigns" element={<CampaignManager />} />
          <Route path="linkedin-feed" element={<LinkedinFeed />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
