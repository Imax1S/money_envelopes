import { Envelope, GameDifficulty } from '../types';

export const formatCurrency = (amount: number, currency: string = '₽'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('RUB', currency);
};

export const generateEnvelopes = (
  total: number, 
  days: number, 
  difficulty: GameDifficulty
): Envelope[] => {
  // Validation to prevent impossible distribution (minimum 1 unit per day)
  if (total < days) total = days;

  const baseAvg = total / days;
  let variance = 0.3; // Default 30%

  if (difficulty === GameDifficulty.EASY) variance = 0.1;
  if (difficulty === GameDifficulty.HARD) variance = 0.6;

  let envelopes: number[] = new Array(days).fill(0);
  let currentSum = 0;

  // Generate initial random amounts
  for (let i = 0; i < days; i++) {
    const min = Math.max(1, baseAvg * (1 - variance));
    const max = Math.max(1, baseAvg * (1 + variance));
    
    // Generate random amount within range
    let amount = Math.floor(Math.random() * (max - min + 1)) + min;
    amount = Math.max(1, Math.floor(amount)); 
    
    envelopes[i] = amount;
    currentSum += amount;
  }

  // Adjust to match exact total
  let diff = total - currentSum;

  // OPTIMIZATION: If difference is large, distribute in chunks first
  // This prevents millions of iterations in the while loop below
  if (Math.abs(diff) > days * 2) {
    const chunk = Math.floor(diff / days);
    if (chunk !== 0) {
      for (let i = 0; i < days; i++) {
        // Prevent going below 1
        if (diff < 0 && envelopes[i] + chunk < 1) continue;

        envelopes[i] += chunk;
        currentSum += chunk;
      }
      // Recalculate diff after bulk adjustment
      diff = total - currentSum;
    }
  }

  // Fine-tuning the remainder one by one
  // Added safety counter to prevent browser freeze
  let safetyCounter = 0;
  const MAX_ITERATIONS = 200000; 

  while (diff !== 0 && safetyCounter < MAX_ITERATIONS) {
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
    safetyCounter++;
  }

  // Emergency fallback if loop exited due to safety counter (very rare)
  if (diff !== 0) {
      // Forcefully distribute remainder to the first capable envelopes
      for (let i = 0; i < days; i++) {
          if (diff === 0) break;
          
          if (diff > 0) {
              envelopes[i] += diff;
              diff = 0;
          } else if (diff < 0) {
              const available = envelopes[i] - 1;
              if (available > 0) {
                  const take = Math.min(available, Math.abs(diff));
                  envelopes[i] -= take;
                  diff += take;
              }
          }
      }
  }

  // Shuffle array using Fisher-Yates
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