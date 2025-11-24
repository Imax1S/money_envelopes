export interface Envelope {
  id: number;
  amount: number;
  isOpen: boolean;
  openedAt?: string; // ISO date string
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode; // We will render this directly
  conditionType: 'amount' | 'streak' | 'completion';
  threshold?: number;
}

export interface SavingsState {
  targetAmount: number;
  days: number;
  currency: string;
  startDate: string;
  envelopes: Envelope[];
  isSetup: boolean;
  unlockedAchievements: string[]; // Array of Achievement IDs
}

export enum GameDifficulty {
  EASY = 'easy',     // Less variance
  MEDIUM = 'medium', // Normal variance
  HARD = 'hard'      // High variance
}