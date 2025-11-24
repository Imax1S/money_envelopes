import { Envelope, SavingsState } from '../types';

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_step',
    title: 'Первый шаг',
    description: 'Откройте свой первый конверт',
    icon: '🚀',
    conditionType: 'completion',
    threshold: 0
  },
  {
    id: 'saved_1000',
    title: 'Копилка',
    description: 'Накоплена первая 1 000 ₽',
    icon: '🐷',
    conditionType: 'amount',
    threshold: 1000
  },
  {
    id: 'saved_5000',
    title: 'Банкир',
    description: 'Накоплено 5 000 ₽',
    icon: '💼',
    conditionType: 'amount',
    threshold: 5000
  },
  {
    id: 'saved_10000',
    title: 'Магнат',
    description: 'Накоплено 10 000 ₽',
    icon: '💎',
    conditionType: 'amount',
    threshold: 10000
  },
  {
    id: 'streak_3',
    title: 'Разминка',
    description: '3 дня подряд вы открываете конверты',
    icon: '🔥',
    conditionType: 'streak',
    threshold: 3
  },
  {
    id: 'streak_7',
    title: 'Неделя дисциплины',
    description: '7 дней подряд без пропусков',
    icon: '📅',
    conditionType: 'streak',
    threshold: 7
  },
  {
    id: 'half_way',
    title: 'Экватор',
    description: 'Половина суммы собрана',
    icon: '⚖️',
    conditionType: 'completion',
    threshold: 50 // Special logic for 50%
  },
  {
    id: 'goal_reached',
    title: 'Мечта сбылась',
    description: 'Цель полностью достигнута!',
    icon: '🏆',
    conditionType: 'completion',
    threshold: 100
  }
];

export const checkNewAchievements = (
  state: SavingsState,
  newEnvelope: Envelope
): string[] => {
  const newUnlocked: string[] = [];
  const currentUnlocked = new Set(state.unlockedAchievements || []);

  const openedEnvelopes = state.envelopes.filter(e => e.isOpen);
  const totalSaved = openedEnvelopes.reduce((sum, e) => sum + e.amount, 0);
  const percent = (totalSaved / state.targetAmount) * 100;

  // 1. Amount Checks
  ACHIEVEMENTS_LIST.filter(a => a.conditionType === 'amount').forEach(ach => {
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

  ACHIEVEMENTS_LIST.filter(a => a.conditionType === 'streak').forEach(ach => {
    if (!currentUnlocked.has(ach.id) && maxStreak >= (ach.threshold || 0)) {
      newUnlocked.push(ach.id);
    }
  });

  return newUnlocked;
};