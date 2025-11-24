import React from 'react';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currency, 
  onCurrencyChange 
}) => {
  if (!isOpen) return null;

  const currencies = [
    { code: 'RUB', label: 'Российский Рубль (₽)' },
    { code: 'USD', label: 'Доллар США ($)' },
    { code: 'EUR', label: 'Евро (€)' },
    { code: 'KZT', label: 'Тенге (₸)' },
    { code: 'BYN', label: 'Белорусский рубль (Br)' },
    { code: 'UAH', label: 'Гривна (₴)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-pop-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Настройки</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Валюта
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
              Изменение валюты обновит отображение всех сумм.
            </p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end">
          <Button onClick={onClose} variant="primary">
            Готово
          </Button>
        </div>
      </div>
    </div>
  );
};