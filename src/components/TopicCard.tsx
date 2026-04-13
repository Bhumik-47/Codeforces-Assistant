import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Tag } from 'lucide-react';
import { TopicData } from '../types';

interface TopicCardProps {
  topic: TopicData;
  rank: number;
}

const RATING_COLORS: Record<number, string> = {
  800: 'text-slate-400',
  900: 'text-slate-400',
  1000: 'text-slate-400',
  1100: 'text-slate-400',
  1200: 'text-green-400',
  1300: 'text-green-400',
  1400: 'text-cyan-400',
  1500: 'text-cyan-400',
  1600: 'text-blue-400',
  1700: 'text-blue-400',
  1800: 'text-blue-400',
  1900: 'text-violet-400',
  2000: 'text-violet-400',
  2100: 'text-orange-400',
  2200: 'text-orange-400',
  2300: 'text-orange-400',
  2400: 'text-red-400',
  2500: 'text-red-400',
  2600: 'text-red-400',
  2700: 'text-red-500',
  2800: 'text-red-500',
  2900: 'text-red-500',
  3000: 'text-red-600',
};

function getRatingColor(rating?: number): string {
  if (!rating) return 'text-slate-500';
  const key = Math.floor(rating / 100) * 100;
  return RATING_COLORS[Math.min(key, 3000)] || 'text-red-600';
}

function getRatingBg(rating?: number): string {
  if (!rating) return 'bg-slate-800';
  if (rating < 1200) return 'bg-slate-800';
  if (rating < 1400) return 'bg-green-900/20';
  if (rating < 1600) return 'bg-cyan-900/20';
  if (rating < 1900) return 'bg-blue-900/20';
  if (rating < 2100) return 'bg-violet-900/20';
  if (rating < 2400) return 'bg-orange-900/20';
  return 'bg-red-900/20';
}

export default function TopicCard({ topic, rank }: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const topRating = topic.problems
    .filter(p => p.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]?.rating;

  const sortedProblems = [...topic.problems].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className={`bg-slate-900 border rounded-xl transition-all duration-300 overflow-hidden ${expanded ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' : 'border-slate-700/50 hover:border-slate-600/50'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left flex items-start justify-between gap-4 group"
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mt-0.5">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-sm capitalize leading-tight">{topic.name}</h3>
              {rank <= 3 && (
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">
                  #{rank}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-400 text-xs">{topic.count} solved</span>
              {topRating && (
                <span className={`text-xs font-medium ${getRatingColor(topRating)}`}>
                  Best: {topRating}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-white leading-none">{topic.count}</div>
            <div className="text-slate-500 text-xs mt-0.5">problems</div>
          </div>
          <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-700/50">
          <div className="px-5 py-2 bg-slate-800/30 flex items-center justify-between">
            <span className="text-xs text-slate-500">Sorted by rating (highest first)</span>
            <span className="text-xs text-slate-500">{topic.count} problems</span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50">
            {sortedProblems.map(problem => (
              <a
                key={`${problem.contestId}-${problem.index}`}
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-2.5 hover:bg-slate-800/50 transition-colors group/item"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${getRatingBg(problem.rating)} ${getRatingColor(problem.rating)} font-semibold flex-shrink-0`}>
                    {problem.rating ?? '?'}
                  </span>
                  <span className="text-slate-300 text-sm truncate group-hover/item:text-white transition-colors">
                    {problem.name}
                  </span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover/item:text-slate-400 flex-shrink-0 ml-2 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
