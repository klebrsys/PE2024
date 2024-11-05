import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
      className="p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
    >
      {language.toUpperCase()}
    </button>
  );
}