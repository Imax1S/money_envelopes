import React from 'react';
import { Button } from './Button';
import { Language } from '../types';
import { translations } from '../services/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currency, 
  onCurrencyChange,
  lang,
  onLanguageChange
}) => {
  const t = translations[lang];
  if (!isOpen) return null;

  const currencies = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'RUB', label: 'Russian Ruble (₽)' },
    { code: 'KZT', label: 'Tenge (₸)' },
    { code: 'BYN', label: 'Belarusian Ruble (Br)' },
    { code: 'UAH', label: 'Hryvnia (₴)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-pop-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">{t.settings}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onLanguageChange('en')}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  lang === 'en' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                English
              </button>
              <button 
                onClick={() => onLanguageChange('ru')}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  lang === 'ru' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Русский
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t.currency}
            </label>
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              {t.currencyUpdateNote}
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end">
          <Button onClick={onClose} variant="primary">
            {t.done}
          </Button>
        </div>
      </div>
    </div>
  );
};