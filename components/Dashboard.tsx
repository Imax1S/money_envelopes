import React, { useMemo, useState } from 'react';
import { Envelope, SavingsState } from '../types';
import { formatCurrency, calculateProgress } from '../services/utils';
import { EnvelopeCard } from './EnvelopeCard';
import { Button } from './Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AiAdvisor } from './AiAdvisor';
import { AchievementsPanel } from './AchievementsPanel';

interface DashboardProps {
  state: SavingsState;
  onOpenEnvelope: (id: number) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ state, onOpenEnvelope, onReset }) => {
  const { percentage, saved, total, daysCompleted, daysTotal } = calculateProgress(state.envelopes);
  const [filter, setFilter] = useState<'all' | 'opened' | 'closed'>('all');

  const chartData = useMemo(() => {
    let accumulated = 0;
    const openedEnvelopes = state.envelopes.filter(e => e.isOpen);
    // Sort logic to simulate timeline, using ID as proxy for sequence if openedAt not perfect
    return openedEnvelopes.map((env, idx) => {
        accumulated += env.amount;
        return {
            step: idx + 1,
            amount: accumulated
        }
    });
  }, [state.envelopes]);

  const pieData = [
    { name: 'Накоплено', value: saved },
    { name: 'Осталось', value: total - saved },
  ];
  
  const PIE_COLORS = ['#4f46e5', '#e2e8f0'];

  const filteredEnvelopes = state.envelopes.filter(env => {
    if (filter === 'opened') return env.isOpen;
    if (filter === 'closed') return !env.isOpen;
    return true;
  });

  const daysRemaining = daysTotal - daysCompleted;

  return (
    <div className="min-h-screen pb-12">
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
             <button onClick={onReset} className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors">
               Сбросить
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Card - Enhanced */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 col-span-1 md:col-span-2 flex flex-col justify-between relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start z-10 gap-6">
              <div className="flex-1">
                <p className="text-slate-500 text-sm font-medium mb-1">Прогресс цели</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <h2 className="text-4xl font-bold text-indigo-900">
                    {formatCurrency(saved)}
                  </h2>
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
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="block text-slate-400 text-xs">Осталось собрать</span>
                      <span className="font-semibold text-slate-700">{formatCurrency(total - saved)}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <span className="block text-slate-400 text-xs">Дней пройдено</span>
                      <span className="font-semibold text-slate-700">{daysCompleted} <span className="text-slate-400 font-normal">/ {daysTotal}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donut Chart Visualization */}
              <div className="w-32 h-32 flex-shrink-0 relative hidden sm:block">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400">{percentage.toFixed(0)}%</span>
                 </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Card */}
          <div className="col-span-1">
             <AiAdvisor goal={total} saved={saved} daysRemaining={daysRemaining} />
          </div>
        </div>

        {/* Achievements Section */}
        <AchievementsPanel unlockedIds={state.unlockedAchievements || []} />

        {/* Chart Section (Only if data exists) */}
        {saved > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-72">
             <p className="text-slate-500 text-sm font-medium mb-4">История накоплений</p>
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="step" hide />
                 <YAxis hide domain={[0, total]} />
                 <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={() => ''}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" animationDuration={1000} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        )}

        {/* Filters & Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Ваши конверты</h3>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Все
              </button>
              <button 
                onClick={() => setFilter('closed')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'closed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Закрытые
              </button>
               <button 
                onClick={() => setFilter('opened')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'opened' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Открытые
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredEnvelopes.map((envelope) => (
              <EnvelopeCard 
                key={envelope.id} 
                envelope={envelope} 
                onClick={onOpenEnvelope} 
              />
            ))}
          </div>

          {filteredEnvelopes.length === 0 && (
             <div className="text-center py-12 text-slate-400">
               В этой категории пока нет конвертов.
             </div>
          )}
        </div>
      </main>
    </div>
  );
};