import { Envelope, SavingsState, Achievement, Language } from '../types';
import { translations } from './translations';
import { formatCurrency } from './utils';

export const getAchievementsList = (
  lang: Language,
  targetAmount: number,
  currency: string
): Achievement[] => {
  const t = translations[lang];
  
  // Helper to safely get description (string or function)
  const getDesc = (key: keyof typeof t, amount: number) => {
    const val = t[key];
    if (typeof val === 'function') {
      return val(formatCurrency(amount, currency));
    }
    return val as string;
  };

  return [
    {
      id: 'first_step',
      title: t.ach_first_step_title as string,
      description: t.ach_first_step_desc as string,
      icon: '🚀',
      conditionType: 'completion',
      threshold: 0
    },
    {
      id: 'saved_10_percent',
      title: t.ach_saved_10_percent_title as string,
      description: getDesc('ach_saved_10_percent_desc', targetAmount * 0.1),
      icon: '🌱',
      conditionType: 'amount',
      threshold: targetAmount * 0.1
    },
    {
      id: 'saved_25_percent',
      title: t.ach_saved_25_percent_title as string,
      description: getDesc('ach_saved_25_percent_desc', targetAmount * 0.25),
      icon: '🏃',
      conditionType: 'amount',
      threshold: targetAmount * 0.25
    },
    {
      id: 'saved_50_percent',
      title: t.ach_saved_50_percent_title as string,
      description: getDesc('ach_saved_50_percent_desc', targetAmount * 0.5),
      icon: '⛰️',
      conditionType: 'completion', // Keeping completion but logic is effectively amount/percent
      threshold: 50 // Percent
    },
    {
      id: 'saved_75_percent',
      title: t.ach_saved_75_percent_title as string,
      description: getDesc('ach_saved_75_percent_desc', targetAmount * 0.75),
      icon: '🔥',
      conditionType: 'amount',
      threshold: targetAmount * 0.75
    },
    {
      id: 'streak_3',
      title: t.ach_streak_3_title as string,
      description: t.ach_streak_3_desc as string,
      icon: '⚡',
      conditionType: 'streak',
      threshold: 3
    },
    {
      id: 'streak_7',
      title: t.ach_streak_7_title as string,
      description: t.ach_streak_7_desc as string,
      icon: '📅',
      conditionType: 'streak',
      threshold: 7
    },
    {
      id: 'streak_21',
      title: t.ach_streak_21_title as string,
      description: t.ach_streak_21_desc as string,
      icon: '🧘',
      conditionType: 'streak',
      threshold: 21
    },
    {
      id: 'goal_reached',
      title: t.ach_goal_reached_title as string,
      description: getDesc('ach_goal_reached_desc', targetAmount),
      icon: '🏆',
      conditionType: 'completion',
      threshold: 100
    }
  ];
};

export const checkNewAchievements = (
  state: SavingsState,
  newEnvelope: Envelope
): string[] => {
  // We pass the target amount and currency from state
  const referenceList = getAchievementsList('en', state.targetAmount, state.currency);
  
  const newUnlocked: string[] = [];
  const currentUnlocked = new Set(state.unlockedAchievements || []);

  const openedEnvelopes = state.envelopes.filter(e => e.isOpen);
  const totalSaved = openedEnvelopes.reduce((sum, e) => sum + e.amount, 0);
  const percent = (totalSaved / state.targetAmount) * 100;

  // 1. Amount Checks
  referenceList.filter(a => a.conditionType === 'amount').forEach(ach => {
    if (!currentUnlocked.has(ach.id) && totalSaved >= (ach.threshold || 0)) {
      newUnlocked.push(ach.id);
    }
  });

  // 2. Completion Checks
  if (!currentUnlocked.has('first_step') && openedEnvelopes.length > 0) {
    newUnlocked.push('first_step');
  }
  
  // 50% check (reused as saved_50_percent but condition is completion/percent based in old logic? 
  // Wait, in getAchievementsList I set conditionType='completion' and threshold=50 for saved_50_percent
  // Let's treat it consistently.
  
  if (!currentUnlocked.has('saved_50_percent') && percent >= 50) {
    newUnlocked.push('saved_50_percent');
  }
  
  if (!currentUnlocked.has('goal_reached') && percent >= 100) {
    newUnlocked.push('goal_reached');
  }

  // 3. Streak Checks
  // Get unique dates from opened envelopes
  const dates = openedEnvelopes
    .map(e => e.openedAt ? new Date(e.openedAt).toDateString() : null)
    .filter(Boolean) as string[];
  
  // Remove duplicates and sort
  const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d).getTime()).sort((a, b) => a - b);
  
  let currentStreak = 0;
  let maxStreak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const diffTime = Math.abs(uniqueDates[i] - uniqueDates[i - 1]);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }

  referenceList.filter(a => a.conditionType === 'streak').forEach(ach => {
    if (!currentUnlocked.has(ach.id) && maxStreak >= (ach.threshold || 0)) {
      newUnlocked.push(ach.id);
    }
  });

  return newUnlocked;
};
