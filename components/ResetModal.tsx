import React from 'react';
import { Button } from './Button';
import { Language } from '../types';
import { translations } from '../services/translations';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lang: Language;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirm, lang }) => {
  const t = translations[lang];
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-pop-in">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{t.resetTitle}</h3>
          <p className="text-slate-500 text-sm mb-6">
            {t.resetDesc}
          </p>
          
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" fullWidth>
              {t.cancel}
            </Button>
            <Button onClick={onConfirm} variant="danger" fullWidth>
              {t.confirmReset}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};