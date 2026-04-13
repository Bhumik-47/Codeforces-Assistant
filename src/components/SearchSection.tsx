import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ExternalLink, X, Tag } from 'lucide-react';
import { ProblemData } from '../types';
import { filterProblems } from '../utils/dataProcessing';

interface SearchSectionProps {
  problems: ProblemData[];
}

const RATING_MIN = 800;
const RATING_MAX = 3500;

function getRatingColor(rating?: number): string {
  if (!rating) return 'text-slate-500';
  if (rating < 1200) return 'text-slate-400';
  if (rating < 1400) return 'text-green-400';
  if (rating < 1600) return 'text-cyan-400';
  if (rating < 1900) return 'text-blue-400';
  if (rating < 2100) return 'text-violet-400';
  if (rating < 2400) return 'text-orange-400';
  return 'text-red-400';
}

function getRatingBadge(rating?: number): string {
  if (!rating) return 'bg-slate-800 text-slate-500';
  if (rating < 1200) return 'bg-slate-800 text-slate-400';
  if (rating < 1400) return 'bg-green-900/20 text-green-400';
  if (rating < 1600) return 'bg-cyan-900/20 text-cyan-400';
  if (rating < 1900) return 'bg-blue-900/20 text-blue-400';
  if (rating < 2100) return 'bg-violet-900/20 text-violet-400';
  if (rating < 2400) return 'bg-orange-900/20 text-orange-400';
  return 'bg-red-900/20 text-red-400';
}

export default function SearchSection({ problems }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [minRating, setMinRating] = useState(RATING_MIN);
  const [maxRating, setMaxRating] = useState(RATING_MAX);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () => filterProblems(problems, query, minRating, maxRating),
    [problems, query, minRating, maxRating]
  );

  const isFiltered = query.trim() || minRating > RATING_MIN || maxRating < RATING_MAX;

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, tag, or contest ID..."
              className="w-full bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || minRating > RATING_MIN || maxRating < RATING_MAX ? 'bg-blue-600/20 border-blue-500/40 text-blue-400' : 'bg-slate-800/80 border-slate-600/50 text-slate-400 hover:text-slate-300'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-slate-800/50 rounded-xl p-4 space-y-4 border border-slate-700/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Rating Filter</span>
              <span className="text-xs text-blue-400 font-mono">{minRating} – {maxRating}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Min Rating</label>
                <input
                  type="range"
                  min={RATING_MIN}
                  max={RATING_MAX}
                  step={100}
                  value={minRating}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setMinRating(Math.min(val, maxRating - 100));
                  }}
                  className="w-full accent-blue-500 h-1.5 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>{RATING_MIN}</span>
                  <span className={`font-semibold ${getRatingColor(minRating)}`}>{minRating}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Max Rating</label>
                <input
                  type="range"
                  min={RATING_MIN}
                  max={RATING_MAX}
                  step={100}
                  value={maxRating}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setMaxRating(Math.max(val, minRating + 100));
                  }}
                  className="w-full accent-blue-500 h-1.5 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span className={`font-semibold ${getRatingColor(maxRating)}`}>{maxRating}</span>
                  <span>{RATING_MAX}</span>
                </div>
              </div>
            </div>
            {(minRating > RATING_MIN || maxRating < RATING_MAX) && (
              <button
                onClick={() => { setMinRating(RATING_MIN); setMaxRating(RATING_MAX); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Reset rating filter
              </button>
            )}
          </div>
        )}
      </div>

      {isFiltered && (
        <div>
          <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-700/40 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
            </span>
            {query && (
              <span className="text-xs text-slate-600">
                Searching: <span className="text-slate-400 font-medium">"{query}"</span>
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/50">
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-slate-500 text-sm">No problems match your search</p>
              </div>
            ) : (
              filtered.map(problem => (
                <a
                  key={`${problem.contestId}-${problem.index}`}
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-semibold flex-shrink-0 ${getRatingBadge(problem.rating)}`}>
                      {problem.rating ?? '?'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-slate-300 text-sm truncate group-hover:text-white transition-colors">
                        {problem.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {problem.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="inline-flex items-center gap-0.5 text-xs text-slate-600">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 3 && (
                          <span className="text-xs text-slate-700">+{problem.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-xs text-slate-600 font-mono hidden sm:block">#{problem.contestId}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
