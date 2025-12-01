import React, { useState, useEffect, useMemo } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SavingsState, GameDifficulty, Language } from './types';
import { generateEnvelopes, debounce } from './services/utils';
import { checkNewAchievements } from './services/achievementService';
import { saveRemoteState, loadRemoteState, generateSyncId } from './services/firebase';

const STORAGE_KEY = 'money_envelopes_state';
const SETTINGS_KEY = 'money_envelopes_settings';
const SYNC_ID_KEY = 'money_envelopes_sync_id';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<SavingsState | null>(null);
  const [language, setLanguage] = useState<Language>('en'); // Default to English
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncId, setSyncId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Memoized debounced saver to prevent spamming Firebase
  const debouncedSave = useMemo(
    () => debounce(async (id: string, state: SavingsState) => {
      console.log('Syncing to cloud...');
      setSyncStatus('saving');
      try {
        await saveRemoteState(id, state);
        setSyncStatus('saved');
      } catch (e) {
        console.error("Save failed", e);
        setSyncStatus('error');
      }
    }, 2000),
    []
  );

  // Initialization Logic
  useEffect(() => {
    const initApp = async () => {
      // 1. Load Settings (Language) - Independent of ID
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          if (parsedSettings.language) setLanguage(parsedSettings.language);
        } catch(e) {
          console.error("Failed to parse settings", e);
        }
      }

      // 2. Resolve ID
      const params = new URLSearchParams(window.location.search);
      let currentId = params.get('id');

      if (currentId) {
        // CASE A: ID exists -> Load from Cloud
        setSyncId(currentId);
        localStorage.setItem(SYNC_ID_KEY, currentId); // Ensure it's saved

        try {
          // Race condition: Give Firebase 3 seconds to load, otherwise fail gracefully
          const loadPromise = loadRemoteState(currentId);
          const timeoutPromise = new Promise<null>((resolve) => 
            setTimeout(() => resolve(null), 3000)
          );
          
          const remoteState = await Promise.race([loadPromise, timeoutPromise]);
          
          if (remoteState) {
            if (!remoteState.unlockedAchievements) remoteState.unlockedAchievements = [];
            if (!remoteState.currency) remoteState.currency = 'RUB';

            setGameState(remoteState);
          }
        } catch (e) {
          console.error("Failed to load remote state", e);
        }
      } else {
        // CASE B: No ID -> Explicit New Game
        currentId = generateSyncId();
        setSyncId(currentId);
        localStorage.setItem(SYNC_ID_KEY, currentId); 

        // Update URL
        const newUrl = `${window.location.pathname}?id=${currentId}`;
        window.history.replaceState({}, '', newUrl);

        // Strict Mode: If user enters without ID, we assume a fresh start.
        // We wipe any existing local data to prevent accidental migration of old sessions to this new ID.
        localStorage.removeItem(STORAGE_KEY);
        setGameState(null);
      }

      setIsLoaded(true);
    };

    initApp().catch(e => {
      console.error("Unhandled initialization error", e);
      setIsLoaded(true);
    });
  }, []);

  // Save Game State
  useEffect(() => {
    if (isLoaded && gameState) {
      // Always save locally as backup/cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));

      // Sync to cloud if we have an ID
      if (syncId) {
        debouncedSave(syncId, gameState);
      }
    }
  }, [gameState, isLoaded, syncId, debouncedSave]);

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

  const handleSync = async (code: string): Promise<boolean> => {
    try {
      const remoteState = await loadRemoteState(code);
      if (remoteState) {
        if (!remoteState.unlockedAchievements) remoteState.unlockedAchievements = [];
        if (!remoteState.currency) remoteState.currency = 'RUB';

        setSyncId(code);
        localStorage.setItem(SYNC_ID_KEY, code); // Persist new ID
        setGameState(remoteState);
        
        const newUrl = `${window.location.pathname}?id=${code}`;
        window.history.replaceState({}, '', newUrl);
        return true;
      }
    } catch (e) {
      console.error("Sync failed", e);
    }
    return false;
  };

  const handleOpenEnvelope = (id: number) => {
    if (!gameState) return;

    // Calculate next Day Number
    const maxDay = gameState.envelopes.reduce((max, env) => {
        return Math.max(max, env.dayNumber || 0);
    }, 0);
    const nextDay = maxDay + 1;

    let openedEnvelope = null;

    const updatedEnvelopes = gameState.envelopes.map(env => {
      if (env.id === id && !env.isOpen) {
        openedEnvelope = { 
            ...env, 
            isOpen: true, 
            openedAt: new Date().toISOString(),
            dayNumber: nextDay
        };
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
    // Clear local storage
    localStorage.removeItem(STORAGE_KEY);
    // We keep the syncId but clear the state. 
    // The user will see the SetupScreen.
    // If they start a new game, it will overwrite the Cloud data for this ID.
    setGameState(null);
  };

  const handleUpdateCurrency = (currency: string) => {
    if (!gameState) return;
    setGameState({ ...gameState, currency });
  };

  if (!isLoaded) return null;

  if (!gameState || !gameState.isSetup) {
    return <SetupScreen onStart={handleStart} onSync={handleSync} lang={language} />;
  }

  return (
    <Dashboard 
      state={gameState} 
      onOpenEnvelope={handleOpenEnvelope} 
      onReset={handleReset}
      onUpdateCurrency={handleUpdateCurrency}
      lang={language}
      onLanguageChange={setLanguage}
      syncStatus={syncStatus}
    />
  );
};

export default App;
