import zxcvbn from 'zxcvbn';

export interface PasswordAnalysis {
  score: number;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crackTimesDisplay: {
    offline_fast_hashing_1e10_per_second: string;
  };
}

export function analyzePassword(password: string): PasswordAnalysis {
  const result = zxcvbn(password);
  return {
    score: result.score,
    feedback: result.feedback,
    crackTimesDisplay: result.crack_times_display
  };
}

export function getScoreColor(score: number): string {
  switch (score) {
    case 0: return 'text-red-500';
    case 1: return 'text-orange-500';
    case 2: return 'text-yellow-500';
    case 3: return 'text-cyan-500';
    case 4: return 'text-cyan-400';
    default: return 'text-gray-500';
  }
}

export function getScoreText(score: number): string {
  switch (score) {
    case 0: return 'Very Weak';
    case 1: return 'Weak';
    case 2: return 'Fair';
    case 3: return 'Strong';
    case 4: return 'Very Strong';
    default: return 'Unknown';
  }
}