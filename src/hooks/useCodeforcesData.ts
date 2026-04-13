import { useState, useCallback } from 'react';
import { ProblemData, TopicData, UserStats, CFSubmission } from '../types';
import { processSubmissions, groupByTopics, computeStats } from '../utils/dataProcessing';

interface CodeforcesState {
  problems: ProblemData[];
  topics: TopicData[];
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
}

export function useCodeforcesData() {
  const [state, setState] = useState<CodeforcesState>({
    problems: [],
    topics: [],
    stats: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async (handle: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(
        `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`
      );

      if (!res.ok) throw new Error('Network error while contacting Codeforces API');

      const json = await res.json();

      if (json.status === 'FAILED') {
        throw new Error(json.comment || 'Failed to fetch submissions');
      }

      const submissions: CFSubmission[] = json.result;
      const problems = processSubmissions(submissions);
      const topics = groupByTopics(problems);
      const stats = computeStats(handle, problems, topics);

      setState({ problems, topics, stats, loading: false, error: null });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      setState(prev => ({ ...prev, loading: false, error: msg }));
      return false;
    }
  }, []);

  return { ...state, fetchData };
}
