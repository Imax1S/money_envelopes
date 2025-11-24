import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SavingsState, GameDifficulty } from './types';
import { generateEnvelopes } from './services/utils';
import { checkNewAchievements } from './services/achievementService';

const STORAGE_KEY = 'money_envelopes_state';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<SavingsState | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure legacy saves have achievements array
        if (!parsed.unlockedAchievements) {
          parsed.unlockedAchievements = [];
        }
        setGameState(parsed);
      } catch (e) {
        console.error("Failed to parse saved state", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const handleStart = (amount: number, days: number, difficulty: GameDifficulty) => {
    const envelopes = generateEnvelopes(amount, days, difficulty);
    const newState: SavingsState = {
      targetAmount: amount,
      days,
      currency: 'RUB',
      startDate: new Date().toISOString(),
      envelopes,
      isSetup: true,
      unlockedAchievements: [],
    };
    setGameState(newState);
  };

  const handleOpenEnvelope = (id: number) => {
    if (!gameState) return;

    // Toggle envelope state (or just open it)
    let openedEnvelope = null;

    const updatedEnvelopes = gameState.envelopes.map(env => {
      if (env.id === id && !env.isOpen) {
        openedEnvelope = { ...env, isOpen: true, openedAt: new Date().toISOString() };
        return openedEnvelope;
      }
      return env;
    });

    // Check if anything actually changed
    if (!openedEnvelope) return;

    const interimState = { ...gameState, envelopes: updatedEnvelopes };

    // Check achievements
    const newAchievements = checkNewAchievements(interimState, openedEnvelope);
    const finalUnlocked = [ ...interimState.unlockedAchievements, ...newAchievements ];

    // If new achievements, we could trigger a toast here in the future
    if (newAchievements.length > 0) {
      // console.log("New Achievements Unlocked:", newAchievements);
    }

    setGameState({ 
      ...interimState, 
      unlockedAchievements: finalUnlocked
    });
  };

  const handleReset = () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс? Все данные будут удалены.')) {
      setGameState(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!gameState || !gameState.isSetup) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <Dashboard 
      state={gameState} 
      onOpenEnvelope={handleOpenEnvelope} 
      onReset={handleReset}
    />
  );
};

export default App;