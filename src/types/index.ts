export interface ProblemData {
  name: string;
  rating?: number;
  contestId: number;
  index: string;
  tags: string[];
  url: string;
  solvedAt: number;
}

export interface TopicData {
  name: string;
  count: number;
  problems: ProblemData[];
}

export interface UserStats {
  handle: string;
  totalSolved: number;
  uniqueTopics: number;
  avgRating: number;
  maxRating: number;
}

export interface CFSubmission {
  id: number;
  verdict: string;
  creationTimeSeconds: number;
  problem: {
    contestId: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
  };
}
