import { Envelope, SavingsState, Achievement, Language } from '../types';
import { translations } from './translations';

export const getAchievementsList = (lang: Language): Achievement[] => {
  const t = translations[lang];
  return [
    {
      id: 'first_step',
      title: t.ach_first_step_title,
      description: t.ach_first_step_desc,
      icon: '🚀',
      conditionType: 'completion',
      threshold: 0
    },
    {
      id: 'saved_1000',
      title: t.ach_saved_1000_title,
      description: t.ach_saved_1000_desc,
      icon: '🐷',
      conditionType: 'amount',
      threshold: 1000
    },
    {
      id: 'saved_5000',
      title: t.ach_saved_5000_title,
      description: t.ach_saved_5000_desc,
      icon: '💼',
      conditionType: 'amount',
      threshold: 5000
    },
    {
      id: 'saved_10000',
      title: t.ach_saved_10000_title,
      description: t.ach_saved_10000_desc,
      icon: '💎',
      conditionType: 'amount',
      threshold: 10000
    },
    {
      id: 'streak_3',
      title: t.ach_streak_3_title,
      description: t.ach_streak_3_desc,
      icon: '🔥',
      conditionType: 'streak',
      threshold: 3
    },
    {
      id: 'streak_7',
      title: t.ach_streak_7_title,
      description: t.ach_streak_7_desc,
      icon: '📅',
      conditionType: 'streak',
      threshold: 7
    },
    {
      id: 'half_way',
      title: t.ach_half_way_title,
      description: t.ach_half_way_desc,
      icon: '⚖️',
      conditionType: 'completion',
      threshold: 50 // Special logic for 50%
    },
    {
      id: 'goal_reached',
      title: t.ach_goal_reached_title,
      description: t.ach_goal_reached_desc,
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
  // We use English ID keys for logic, so we can just grab the structure from 'en' or any lang
  // The IDs are constant across languages
  const referenceList = getAchievementsList('en'); 
  
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
  if (!currentUnlocked.has('half_way') && percent >= 50) {
    newUnlocked.push('half_way');
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