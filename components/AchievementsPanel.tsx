import React from 'react';
import { ACHIEVEMENTS_LIST } from '../services/achievementService';

interface AchievementsPanelProps {
  unlockedIds: string[];
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ unlockedIds }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.612-3.125 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Достижения</h3>
        <span className="ml-auto text-sm font-medium text-slate-500">
          {unlockedIds.length} / {ACHIEVEMENTS_LIST.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div 
              key={ach.id}
              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`text-2xl ${isUnlocked ? 'scale-110' : ''} transition-transform`}>
                  {ach.icon}
                </div>
                {isUnlocked && (
                  <div className="bg-yellow-100 rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-yellow-600">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <h4 className={`font-semibold text-sm mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                {ach.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {ach.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};