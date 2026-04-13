import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TopicData } from '../types';
import { TrendingUp } from 'lucide-react';

interface TopicsChartProps {
  topics: TopicData[];
}

const BAR_COLORS = ['#3b82f6', '#06b6d4', '#22d3ee', '#38bdf8', '#7dd3fc'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white text-sm font-semibold capitalize">{payload[0].payload.name}</p>
      <p className="text-blue-400 text-xs mt-0.5">{payload[0].value} problems solved</p>
    </div>
  );
}

export default function TopicsChart({ topics }: TopicsChartProps) {
  const top5 = topics.slice(0, 5).map(t => ({ name: t.name, count: t.count }));

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">Top 5 Strongest Topics</h2>
          <p className="text-slate-500 text-xs">By number of problems solved</p>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={top5}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {top5.map((_, idx) => (
                <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
