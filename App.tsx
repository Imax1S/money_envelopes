import React, { useState, useEffect, useMemo } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SavingsState, GameDifficulty, Language } from './types';
import { generateEnvelopes, debounce } from './services/utils';
import { checkNewAchievements } from './services/achievementService';
import { saveRemoteState, loadRemoteState, generateSyncId } from './services/firebase';

const STORAGE_KEY = 'money_envelopes_state';
const SETTINGS_KEY = 'money_envelopes_settings';

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

      // 2. Check URL for ID
      const params = new URLSearchParams(window.location.search);
      let currentId = params.get('id');

      if (currentId) {
        // CASE A: ID exists -> Load from Cloud
        setSyncId(currentId);
        try {
          // Race condition: Give Firebase 3 seconds to load, otherwise fail gracefully
          // This prevents white screen if network is hanging
          const loadPromise = loadRemoteState(currentId);
          const timeoutPromise = new Promise<null>((resolve) => 
            setTimeout(() => resolve(null), 3000)
          );
          
          const remoteState = await Promise.race([loadPromise, timeoutPromise]);
          
          if (remoteState) {
             // Backwards compatibility
            if (!remoteState.unlockedAchievements) remoteState.unlockedAchievements = [];
            if (!remoteState.currency) remoteState.currency = 'RUB';
            setGameState(remoteState);
          }
        } catch (e) {
          console.error("Failed to load remote state", e);
        }
      } else {
        // CASE B: No ID -> Legacy LocalStorage or New User
        currentId = generateSyncId();
        setSyncId(currentId);

        // Update URL so user can copy it immediately
        const newUrl = `${window.location.pathname}?id=${currentId}`;
        window.history.replaceState({}, '', newUrl);

        // Check if we have local data to migrate
        const savedGame = localStorage.getItem(STORAGE_KEY);
        if (savedGame) {
          try {
            const parsed = JSON.parse(savedGame);
            if (!parsed.unlockedAchievements) parsed.unlockedAchievements = [];
            if (!parsed.currency) parsed.currency = 'RUB';
            
            setGameState(parsed);
            // Sync existing local data to the new Cloud ID
            saveRemoteState(currentId, parsed);
          } catch (e) {
            console.error("Failed to parse saved state", e);
            localStorage.removeItem(STORAGE_KEY);
          }
        }
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
      syncStatus={syncStatus}
    />
  );
};

export default App;
