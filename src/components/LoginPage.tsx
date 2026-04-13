import { useState } from 'react';
import { Code2, Terminal, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (handle: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function LoginPage({ onLogin, loading, error }: LoginPageProps) {
  const [handle, setHandle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    await onLogin(handle.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-5">
            <Code2 className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">CF Tracker</h1>
          <p className="text-slate-400 text-sm">Codeforces Personal Progress Tracker</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 text-sm font-medium">Enter your Codeforces handle</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-widest">
                Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="e.g. tourist"
                className="w-full bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !handle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Fetching submissions...</span>
                </>
              ) : (
                <>
                  <span>Load My Progress</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <p className="text-slate-500 text-xs text-center leading-relaxed">
              We fetch your public submission history directly from the Codeforces API.
              No passwords required.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          {['dp', 'graphs', 'greedy', 'math', 'trees'].map(tag => (
            <span key={tag} className="text-slate-600 text-xs font-mono">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
