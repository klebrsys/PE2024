import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

export function Header() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {t('auth.welcome')}, {user?.name}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitch />
          
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">{user?.name}</p>
              <p className="text-gray-500">{user?.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}