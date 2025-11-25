import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SavingsState, GameDifficulty, Language } from './types';
import { generateEnvelopes } from './services/utils';
import { checkNewAchievements } from './services/achievementService';

const STORAGE_KEY = 'money_envelopes_state';
const SETTINGS_KEY = 'money_envelopes_settings';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<SavingsState | null>(null);
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    // Load Game State
    const savedGame = localStorage.getItem(STORAGE_KEY);
    if (savedGame) {
      try {
        const parsed = JSON.parse(savedGame);
        if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
        if (!parsed.currency) parsed.currency = 'RUB'; // Legacy fallback
        setGameState(parsed);
      } catch (e) {
        console.error("Failed to parse saved state", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Load Settings (Language)
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.language) setLanguage(parsedSettings.language);
      } catch(e) {
        console.error("Failed to parse settings", e);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save Game State
  useEffect(() => {
    if (isLoaded && gameState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  // Save Settings
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language }));
    }
  }, [language, isLoaded]);

  const handleStart = (amount: number, days: number, difficulty: GameDifficulty, currency: string) => {
    const envelopes = generateEnvelopes(amount, days, difficulty);
    const newState: SavingsState = {
      targetAmount: amount,
      days,
      currency,
      startDate: new Date().toISOString(),
      envelopes,
      isSetup: true,
      unlockedAchievements: [],
    };
    setGameState(newState);
  };

  const handleOpenEnvelope = (id: number) => {
    if (!gameState) return;

    let openedEnvelope = null;

    const updatedEnvelopes = gameState.envelopes.map(env => {
      if (env.id === id && !env.isOpen) {
        openedEnvelope = { ...env, isOpen: true, openedAt: new Date().toISOString() };
        return openedEnvelope;
      }
      return env;
    });

    if (!openedEnvelope) return;

    const interimState = { ...gameState, envelopes: updatedEnvelopes };
    const newAchievements = checkNewAchievements(interimState, openedEnvelope);
    const finalUnlocked = [ ...interimState.unlockedAchievements, ...newAchievements ];

    setGameState({ 
      ...interimState, 
      unlockedAchievements: finalUnlocked
    });
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(null);
  };

  const handleUpdateCurrency = (currency: string) => {
    if (!gameState) return;
    setGameState({ ...gameState, currency });
  };

  if (!isLoaded) return null;

  if (!gameState || !gameState.isSetup) {
    return <SetupScreen onStart={handleStart} lang={language} />;
  }

  return (
    <Dashboard 
      state={gameState} 
      onOpenEnvelope={handleOpenEnvelope} 
      onReset={handleReset}
      onUpdateCurrency={handleUpdateCurrency}
      lang={language}
      onLanguageChange={setLanguage}
    />
  );
};

export default App;