import React, { useState } from 'react';
import { GameDifficulty, Language } from '../types';
import { Button } from './Button';
import { translations } from '../services/translations';

interface SetupScreenProps {
  onStart: (amount: number, days: number, difficulty: GameDifficulty, currency: string) => void;
  onSync: (code: string) => Promise<boolean>;
  lang: Language;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, onSync, lang }) => {
  const t = translations[lang];
  const [isEnteringCode, setIsEnteringCode] = useState(false);
  const [syncCode, setSyncCode] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [days, setDays] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.RANDOM);
  const [currency, setCurrency] = useState<string>('USD'); // Default to USD per prompt requirement for English
  const [error, setError] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'RUB', symbol: '₽' },
    { code: 'KZT', symbol: '₸' },
    { code: 'BYN', symbol: 'Br' },
    { code: 'UAH', symbol: '₴' },
  ];

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!syncCode || syncCode.length < 6) {
      setError(t.codeError);
      return;
    }

    setIsSyncing(true);
    const success = await onSync(syncCode);
    setIsSyncing(false);

    if (!success) {
      setError(t.codeError);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const parsedAmount = parseInt(amount.replace(/\D/g, ''), 10);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t.howMuchError);
      return;
    }

    if (parsedAmount < days) {
      setError(t.minAmountError(days));
      return;
    }

    onStart(parsedAmount, days, difficulty, currency);
  };

  if (isEnteringCode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.enterCode}</h1>
            <p className="text-slate-500">{t.enterCodeDesc}</p>
          </div>

          <form onSubmit={handleSyncSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <input
                type="text"
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value.trim())}
                placeholder={t.codePlaceholder}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg text-center tracking-widest font-mono"
                required
              />
            </div>

            <Button type="submit" fullWidth size="lg" disabled={isSyncing}>
              {isSyncing ? 'Loading...' : t.restore}
            </Button>

            <button 
              type="button" 
              onClick={() => {
                setIsEnteringCode(false);
                setError('');
              }}
              className="w-full text-center text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              {t.cancel}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.createGoal}</h1>
          <p className="text-slate-500">{t.createGoalDesc}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.currency}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={`p-2 rounded-lg text-sm font-bold border transition-all ${
                    currency === curr.code
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {curr.symbol}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.howMuch}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.howMuchPlaceholder}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
              min="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.duration}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="7"
                max="365"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="w-16 text-center font-bold text-lg text-indigo-600 border border-indigo-100 bg-indigo-50 rounded px-2 py-1">
                {days}
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t.week}</span>
              <span>{t.year}</span>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.distribution}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: GameDifficulty.EQUAL, label: t.modeEqual, desc: t.modeEqualDesc, icon: '⚖️' },
                { id: GameDifficulty.PROGRESSION, label: t.modeProgression, desc: t.modeProgressionDesc, icon: '📈' },
                { id: GameDifficulty.RANDOM, label: t.modeRandom, desc: t.modeRandomDesc, icon: '🎲' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-2 rounded-lg text-center border transition-all flex flex-col items-center justify-center gap-1 h-24 ${
                    difficulty === diff.id 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{diff.icon}</span>
                  <div className="font-medium text-sm leading-tight">{diff.label}</div>
                  <div className="text-[10px] opacity-75 leading-tight">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth size="lg">
            {t.startChallenge}
          </Button>

          <div className="pt-2 text-center">
            <button 
              type="button"
              onClick={() => setIsEnteringCode(true)} 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              {t.haveCode}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};