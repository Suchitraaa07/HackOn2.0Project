import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const engagementData = [
  { date: 'Jan 1', likes: 400, comments: 240, shares: 80 },
  { date: 'Jan 8', likes: 620, comments: 310, shares: 140 },
  { date: 'Jan 15', likes: 530, comments: 280, shares: 110 },
  { date: 'Jan 22', likes: 810, comments: 430, shares: 200 },
  { date: 'Jan 29', likes: 940, comments: 510, shares: 260 },
  { date: 'Feb 5', likes: 720, comments: 380, shares: 180 },
  { date: 'Feb 12', likes: 1100, comments: 640, shares: 340 },
];

const bestTimeData = [
  { hour: '8 AM', rate: 3.2 },
  { hour: '10 AM', rate: 4.8 },
  { hour: '12 PM', rate: 6.5 },
  { hour: '2 PM', rate: 5.1 },
  { hour: '4 PM', rate: 7.2 },
  { hour: '6 PM', rate: 8.4 },
  { hour: '8 PM', rate: 6.9 },
  { hour: '10 PM', rate: 4.3 },
];

export function EngagementLineChart({ data = engagementData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Line type="monotone" dataKey="likes" stroke="#6366f1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="comments" stroke="#f59e0b" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BestPostingTimeChart({ data = bestTimeData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
          formatter={(v) => [`${v}%`, 'Engagement Rate']}
        />
        <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Engagement Over Time</h3>
        <EngagementLineChart />
      </div>
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Best Posting Times</h3>
        <BestPostingTimeChart />
      </div>
    </div>
  );
}
