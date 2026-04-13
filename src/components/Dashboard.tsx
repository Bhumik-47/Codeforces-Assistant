import { useState } from 'react';
import { LogOut, Code2, Target, BookOpen, BarChart2, RefreshCw, Trophy, Zap } from 'lucide-react';
import { ProblemData, TopicData, UserStats } from '../types';
import TopicCard from './TopicCard';
import TopicsChart from './TopicsChart';
import SearchSection from './SearchSection';

interface DashboardProps {
  problems: ProblemData[];
  topics: TopicData[];
  stats: UserStats;
  onLogout: () => void;
  onRefresh: () => void;
  loading: boolean;
}

type SortMode = 'count' | 'alpha';

export default function Dashboard({ problems, topics, stats, onLogout, onRefresh, loading }: DashboardProps) {
  const [sortMode, setSortMode] = useState<SortMode>('count');
  const [topicSearch, setTopicSearch] = useState('');

  const sortedTopics = [...topics]
    .filter(t => !topicSearch || t.name.toLowerCase().includes(topicSearch.toLowerCase()))
    .sort((a, b) => {
      if (sortMode === 'alpha') return a.name.localeCompare(b.name);
      return b.count - a.count;
    });

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-tight">CF Tracker</h1>
              <p className="text-slate-500 text-xs leading-tight hidden sm:block">Progress Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-sm font-medium">{stats.handle}</span>
            </div>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700/50 transition-all text-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Target className="w-4 h-4 text-blue-400" />}
            label="Total Solved"
            value={stats.totalSolved.toLocaleString()}
            sub="unique problems"
            accent="blue"
          />
          <StatCard
            icon={<BookOpen className="w-4 h-4 text-cyan-400" />}
            label="Topics Covered"
            value={stats.uniqueTopics.toString()}
            sub="distinct tags"
            accent="cyan"
          />
          <StatCard
            icon={<BarChart2 className="w-4 h-4 text-emerald-400" />}
            label="Avg Rating"
            value={stats.avgRating > 0 ? stats.avgRating.toLocaleString() : '–'}
            sub="of solved problems"
            accent="emerald"
          />
          <StatCard
            icon={<Trophy className="w-4 h-4 text-amber-400" />}
            label="Hardest Solved"
            value={stats.maxRating > 0 ? stats.maxRating.toLocaleString() : '–'}
            sub="max rating"
            accent="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TopicsChart topics={topics} />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">Quick Stats</h2>
                  <p className="text-slate-500 text-xs">At a glance</p>
                </div>
              </div>
              <div className="space-y-3">
                {topics.slice(0, 5).map((topic, i) => (
                  <div key={topic.name} className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs font-mono w-4 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-300 text-xs capitalize truncate">{topic.name}</span>
                        <span className="text-slate-400 text-xs ml-2 flex-shrink-0">{topic.count}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                          style={{ width: `${(topic.count / topics[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SearchSection problems={problems} />

        <div>
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <div>
              <h2 className="text-white font-bold text-base">All Topics</h2>
              <p className="text-slate-500 text-xs mt-0.5">{topics.length} topics — click a card to expand</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={topicSearch}
                onChange={e => setTopicSearch(e.target.value)}
                placeholder="Filter topics..."
                className="bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all w-36"
              />
              <div className="flex bg-slate-800/60 border border-slate-700/40 rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={() => setSortMode('count')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${sortMode === 'count' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  By count
                </button>
                <button
                  onClick={() => setSortMode('alpha')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${sortMode === 'alpha' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  A–Z
                </button>
              </div>
            </div>
          </div>

          {sortedTopics.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No topics match your filter</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedTopics.map((topic, idx) => (
                <TopicCard key={topic.name} topic={topic} rank={topics.indexOf(topic) + 1} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent: 'blue' | 'cyan' | 'emerald' | 'amber';
}

const accentMap = {
  blue: 'bg-blue-600/10 border-blue-500/20',
  cyan: 'bg-cyan-600/10 border-cyan-500/20',
  emerald: 'bg-emerald-600/10 border-emerald-500/20',
  amber: 'bg-amber-600/10 border-amber-500/20',
};

function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${accentMap[accent]} bg-slate-900`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentMap[accent]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-white leading-none mb-1">{value}</div>
      <div className="text-xs text-slate-500 leading-tight">{label}</div>
      <div className="text-xs text-slate-600 leading-tight mt-0.5">{sub}</div>
    </div>
  );
}
