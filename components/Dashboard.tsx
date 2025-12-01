import React, { useState } from 'react';
import { Envelope, SavingsState, Language } from '../types';
import { formatCurrency, calculateProgress } from '../services/utils';
import { EnvelopeCard } from './EnvelopeCard';
import { AchievementsPanel } from './AchievementsPanel';
import { SettingsModal } from './SettingsModal';
import { ResetModal } from './ResetModal';
import { translations } from '../services/translations';

interface DashboardProps {
  state: SavingsState;
  onOpenEnvelope: (id: number) => void;
  onReset: () => void;
  onUpdateCurrency: (currency: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  syncStatus?: 'saved' | 'saving' | 'error';
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  state, 
  onOpenEnvelope, 
  onReset, 
  onUpdateCurrency,
  lang,
  onLanguageChange,
  syncStatus = 'saved'
}) => {
  const t = translations[lang];
  const { percentage, saved, total, daysCompleted, daysTotal } = calculateProgress(state.envelopes);
  const [filter, setFilter] = useState<'all' | 'opened' | 'closed'>('all');
  const [sortMethod, setSortMethod] = useState<'default' | 'amount_asc'>('default'); // Sorting state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Filter first
  let displayEnvelopes = state.envelopes.filter(env => {
    if (filter === 'opened') return env.isOpen;
    if (filter === 'closed') return !env.isOpen;
    return true;
  });

  // Then Sort
  if (sortMethod === 'amount_asc') {
    // Clone to sort safely
    displayEnvelopes = [...displayEnvelopes].sort((a, b) => a.amount - b.amount);
  } else {
    // Sort by Day Number (Opened first), then by ID for closed ones
    displayEnvelopes = [...displayEnvelopes].sort((a, b) => {
        // If both opened, sort by dayNumber
        if (a.isOpen && b.isOpen) {
            return (a.dayNumber || 0) - (b.dayNumber || 0);
        }
        // Opened comes first
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;

        // If both closed, sort by ID to keep stable order
        return a.id - b.id;
    });
  }

  const currency = state.currency || 'RUB';

  const handleConfirmReset = () => {
    onReset();
    setIsResetModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Sync Status Indicator */}
      {syncStatus !== 'saved' && (
        <div className={`fixed top-20 right-4 md:top-4 md:right-4 text-xs px-3 py-1.5 rounded-full shadow-lg z-50 font-medium transition-all duration-300 flex items-center gap-2
          ${syncStatus === 'saving' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
          ${syncStatus === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : ''}
        `}>
          {syncStatus === 'saving' && (
            <>
              <span className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></span>
              Saving...
            </>
          )}
          {syncStatus === 'error' && (
             <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Offline / Sync Error
             </>
          )}
        </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen}  
        onClose={() => setIsSettingsOpen(false)}
        currency={currency}
        onCurrencyChange={onUpdateCurrency}
        lang={lang}
        onLanguageChange={onLanguageChange}
      />
      
      <ResetModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        lang={lang}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">MoneyEnvelopes</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSettingsOpen(true)}
               className="text-slate-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
               title={t.settings}
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             </button>
             <button onClick={() => setIsResetModalOpen(true)} className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors">
               {t.reset}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Progress Card - Enhanced - Full Width */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center relative overflow-hidden gap-6">
            <div className="w-full md:w-2/3 z-10">
              <p className="text-slate-500 text-sm font-medium mb-1">{t.goalProgress}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <h2 className="text-5xl font-bold text-indigo-900">
                  {formatCurrency(saved, currency)}
                </h2>
                <span className="text-slate-400 text-xl font-medium">/ {formatCurrency(total, currency)}</span>
              </div>
              
              <div className="space-y-4">
                <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out flex items-center justify-end px-2"
                    style={{ width: `${percentage}%` }}
                  >
                      {percentage > 10 && <span className="text-[10px] text-white font-bold">{percentage.toFixed(0)}%</span>}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="block text-slate-400 text-xs mb-1">{t.remaining}</span>
                    <span className="font-semibold text-slate-700 block">{formatCurrency(total - saved, currency)}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="block text-slate-400 text-xs mb-1">{t.envelopesOpened}</span>
                    <span className="font-semibold text-slate-700 block">{daysCompleted} <span className="text-slate-400 font-normal">/ {daysTotal}</span></span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="block text-slate-400 text-xs mb-1">{t.progress}</span>
                    <span className="font-semibold text-indigo-600 block">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

             {/* Decorative Illustration */}
             <div className="hidden md:flex justify-center items-center w-1/3 h-full opacity-80">
                <div className="relative w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <AchievementsPanel 
          unlockedIds={state.unlockedAchievements || []} 
          lang={lang} 
          targetAmount={state.targetAmount}
          currency={currency}
        />

        {/* Filters & Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">{t.yourEnvelopes}</h3>
            
            <div className="flex gap-2">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setSortMethod('default')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sortMethod === 'default' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title={t.sortDefault}
                >
                  📅
                </button>
                <button 
                  onClick={() => setSortMethod('amount_asc')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sortMethod === 'amount_asc' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title={t.sortByAmount}
                >
                  $$$
                </button>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.filterAll}
                </button>
                <button 
                  onClick={() => setFilter('closed')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'closed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.filterClosed}
                </button>
                 <button 
                  onClick={() => setFilter('opened')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'opened' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.filterOpened}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayEnvelopes.map((envelope) => (
              <EnvelopeCard 
                key={envelope.id} 
                envelope={envelope} 
                onClick={onOpenEnvelope} 
                currency={currency}
                lang={lang}
              />
            ))}
          </div>

          {displayEnvelopes.length === 0 && (
             <div className="text-center py-12 text-slate-400">
               {t.emptyCategory}
             </div>
          )}
        </div>
      </main>
    </div>
  );
};