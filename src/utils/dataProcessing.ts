import { CFSubmission, ProblemData, TopicData, UserStats } from '../types';

export function processSubmissions(submissions: CFSubmission[]): ProblemData[] {
  const solvedProblems = new Map<string, ProblemData>();

  for (const sub of submissions) {
    if (sub.verdict !== 'OK') continue;
    const { contestId, index, name, rating, tags } = sub.problem;
    const key = `${contestId}-${index}`;
    if (!solvedProblems.has(key)) {
      solvedProblems.set(key, {
        name,
        rating,
        contestId,
        index,
        tags: tags || [],
        url: `https://codeforces.com/problemset/problem/${contestId}/${index}`,
        solvedAt: sub.creationTimeSeconds,
      });
    }
  }

  return Array.from(solvedProblems.values()).sort((a, b) => b.solvedAt - a.solvedAt);
}

export function groupByTopics(problems: ProblemData[]): TopicData[] {
  const topicMap = new Map<string, ProblemData[]>();

  for (const problem of problems) {
    const tags = problem.tags.length > 0 ? problem.tags : ['untagged'];
    for (const tag of tags) {
      if (!topicMap.has(tag)) topicMap.set(tag, []);
      topicMap.get(tag)!.push(problem);
    }
  }

  return Array.from(topicMap.entries())
    .map(([name, probs]) => ({ name, count: probs.length, problems: probs }))
    .sort((a, b) => b.count - a.count);
}

export function computeStats(handle: string, problems: ProblemData[], topics: TopicData[]): UserStats {
  const ratedProblems = problems.filter(p => p.rating !== undefined);
  const avgRating = ratedProblems.length > 0
    ? Math.round(ratedProblems.reduce((acc, p) => acc + (p.rating ?? 0), 0) / ratedProblems.length)
    : 0;
  const maxRating = ratedProblems.length > 0
    ? Math.max(...ratedProblems.map(p => p.rating ?? 0))
    : 0;

  return {
    handle,
    totalSolved: problems.length,
    uniqueTopics: topics.length,
    avgRating,
    maxRating,
  };
}

export function filterProblems(
  problems: ProblemData[],
  query: string,
  minRating: number,
  maxRating: number
): ProblemData[] {
  const q = query.toLowerCase().trim();

  return problems.filter(p => {
    const ratingOk = p.rating === undefined || (p.rating >= minRating && p.rating <= maxRating);
    if (!ratingOk) return false;
    if (!q) return true;

    const nameMatch = p.name.toLowerCase().includes(q);
    const tagMatch = p.tags.some(t => t.toLowerCase().includes(q));
    const contestMatch = String(p.contestId).includes(q);

    return nameMatch || tagMatch || contestMatch;
  });
}
