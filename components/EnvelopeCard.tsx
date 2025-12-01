import React from 'react';
import { Envelope, Language } from '../types';
import { formatCurrency } from '../services/utils';
import { translations } from '../services/translations';

interface EnvelopeCardProps {
  envelope: Envelope;
  onClick: (id: number) => void;
  currency?: string;
  lang: Language;
}

export const EnvelopeCard: React.FC<EnvelopeCardProps> = ({ envelope, onClick, currency = 'RUB', lang }) => {
  const { id, amount, isOpen, dayNumber } = envelope;
  const t = translations[lang];

  if (isOpen) {
    return (
      <div className="relative aspect-[4/3] rounded-xl border-2 border-emerald-100 bg-emerald-50 p-4 flex flex-col items-center justify-center text-emerald-800 transition-all shadow-sm animate-pop-in">
        <div className="absolute top-2 right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-500">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-emerald-600 mb-1">{t.day} {dayNumber}</span>
        <span className="text-xl font-bold">{formatCurrency(amount, currency)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => onClick(id)}
      className="group relative aspect-[4/3] w-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-indigo-300 transition-all duration-200 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Envelope Icon/Illustration */}
      <div className="z-10 text-slate-400 group-hover:text-indigo-500 mb-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </div>

      <span className="z-10 text-sm font-medium text-slate-500 group-hover:text-indigo-600">{t.envelope}</span>
      <span className="z-10 text-xs text-slate-400 mt-1">{t.tapToOpen}</span>
    </button>
  );
};