export interface TestCase {
  id: string;
  name: string;
  description: string;
  testFunction: string;
  expected: string;
}

export interface Lesson {
  id: string;
  title: string;
  trackId: string;
  trackName: string;
  order: number;
  xp: number;
  icon: string;
  difficulty: 'Beginner' | 'Novice' | 'Apprentice';
  storyIntro: string;
  conceptExplanation: string;
  instructions: string[];
  starterCode: string;
  solutionHint: string;
  testCases: TestCase[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  badgeName: string;
  badgeIcon: string;
  totalXp: number;
  lessonCount: number;
}

export interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  expected: string;
  actual?: string;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  logs: string[];
  testResults: TestResult[];
  error?: string;
  executionTimeMs: number;
}
