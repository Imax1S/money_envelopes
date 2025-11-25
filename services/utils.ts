import { Envelope, GameDifficulty } from '../types';

export const formatCurrency = (amount: number, currencyCode: string = 'RUB'): string => {
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${amount} ${currencyCode}`;
  }
};

export const generateEnvelopes = (
  total: number, 
  days: number, 
  mode: GameDifficulty
): Envelope[] => {
  // Validation
  if (total < days) total = days;

  let envelopes: number[] = new Array(days).fill(0);

  switch (mode) {
    case GameDifficulty.EQUAL: {
      const baseAmount = Math.floor(total / days);
      let remainder = total % days;
      
      for (let i = 0; i < days; i++) {
        envelopes[i] = baseAmount + (remainder > 0 ? 1 : 0);
        remainder--;
      }
      break;
    }

    case GameDifficulty.PROGRESSION: {
      // Logic: Create a base arithmetic sequence 0, 1, 2 ... (days-1)
      // Calculate sum of that sequence.
      // Distribute the difference between Target and SequenceSum evenly.
      
      // Sum of 0..N-1 is (N * (N-1)) / 2
      const sequenceSum = (days * (days - 1)) / 2;
      const difference = total - sequenceSum;
      
      const baseOffset = Math.floor(difference / days);
      let remainder = difference % days;

      // Check if baseOffset is negative (shouldn't happen due to total >= days check, 
      // but strictly speaking progression 1..N requires Total >= N*(N+1)/2)
      // If total is small, we just flatten it via max(1, ...)
      
      for (let i = 0; i < days; i++) {
        // The sequence item is i (0-indexed)
        // Add the base offset distributed from the difference
        // Add 1 if there is remainder left
        let amount = i + baseOffset + (remainder > 0 ? 1 : 0);
        if (amount < 1) amount = 1; // Safety floor
        envelopes[i] = amount;
        remainder--;
      }
      
      // Re-sum and fix any tiny discrepancy due to floor limits (rare edge case)
      const currentSum = envelopes.reduce((a, b) => a + b, 0);
      let diff = total - currentSum;
      let idx = 0;
      while (diff !== 0) {
        if (diff > 0) { envelopes[idx]++; diff--; }
        else { if (envelopes[idx] > 1) { envelopes[idx]--; diff++; } }
        idx = (idx + 1) % days;
      }
      break;
    }

    case GameDifficulty.RANDOM:
    default: {
      // Moderate Random (formerly Medium/Balanced)
      const baseAvg = total / days;
      const variance = 0.4; // 40% variance for "Moderate" random

      let currentSum = 0;
      for (let i = 0; i < days; i++) {
        const min = Math.max(1, baseAvg * (1 - variance));
        const max = Math.max(1, baseAvg * (1 + variance));
        
        let amount = Math.floor(Math.random() * (max - min + 1)) + min;
        amount = Math.max(1, amount);
        
        envelopes[i] = amount;
        currentSum += amount;
      }

      // Distribute difference
      let diff = total - currentSum;
      
      // Bulk fix
      if (Math.abs(diff) > days) {
        const chunk = Math.floor(diff / days);
        if (chunk !== 0) {
          for (let i = 0; i < days; i++) {
             if (diff < 0 && envelopes[i] + chunk < 1) continue;
             envelopes[i] += chunk;
             currentSum += chunk;
          }
          diff = total - currentSum;
        }
      }

      // Fine tune
      let safety = 0;
      while (diff !== 0 && safety < 100000) {
        const index = Math.floor(Math.random() * days);
        if (diff > 0) {
          envelopes[index]++;
          diff--;
        } else {
          if (envelopes[index] > 1) {
            envelopes[index]--;
            diff++;
          }
        }
        safety++;
      }
      break;
    }
  }

  // Shuffle the envelopes for the user (Fisher-Yates)
  // Even for progression, we shuffle so the "daily pick" is a surprise game.
  // If user wants ordered progression, they can just pick sequentially, but the IDs are shuffled.
  for (let i = envelopes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [envelopes[i], envelopes[j]] = [envelopes[j], envelopes[i]];
  }

  return envelopes.map((amount, index) => ({
    id: index + 1,
    amount,
    isOpen: false,
  }));
};

export const calculateProgress = (envelopes: Envelope[]) => {
  const total = envelopes.reduce((sum, env) => sum + env.amount, 0);
  const saved = envelopes
    .filter(env => env.isOpen)
    .reduce((sum, env) => sum + env.amount, 0);
  
  const daysTotal = envelopes.length;
  const daysCompleted = envelopes.filter(env => env.isOpen).length;

  return { total, saved, daysTotal, daysCompleted, percentage: total === 0 ? 0 : (saved / total) * 100 };
};