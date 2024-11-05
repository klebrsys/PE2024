import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'pt';
  setLanguage: (lang: 'en' | 'pt') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'dashboard.title': 'Dashboard',
    'companies.title': 'Companies',
    'users.title': 'Users',
    'settings.title': 'Settings',
    'vision.title': 'Vision',
    'mission.title': 'Mission',
    'values.title': 'Values',
    'perspectives.title': 'Perspectives',
    'goals.title': 'Goals',
    'objectives.title': 'Objectives',
    'actionPlans.title': 'Action Plans',
    'swot.title': 'SWOT Analysis',
    'strategicMap.title': 'Strategic Map',
    'strategicMap.goals': 'Goals',
    'strategicMap.noGoals': 'No goals defined for this perspective',
    'strategicMap.expandedView': 'Expanded View',
    'strategicMap.compactView': 'Compact View',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.update': 'Update',
    'common.loading': 'Loading...',
  },
  pt: {
    'dashboard.title': 'Painel',
    'companies.title': 'Empresas',
    'users.title': 'Usuários',
    'settings.title': 'Configurações',
    'vision.title': 'Visão',
    'mission.title': 'Missão',
    'values.title': 'Valores',
    'perspectives.title': 'Perspectivas',
    'goals.title': 'Objetivos',
    'objectives.title': 'Objetivos Estratégicos',
    'actionPlans.title': 'Planos de Ação',
    'swot.title': 'Análise SWOT',
    'strategicMap.title': 'Mapa Estratégico',
    'strategicMap.goals': 'Objetivos',
    'strategicMap.noGoals': 'Nenhum objetivo definido para esta perspectiva',
    'strategicMap.expandedView': 'Visão Expandida',
    'strategicMap.compactView': 'Visão Compacta',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.create': 'Criar',
    'common.add': 'Adicionar',
    'common.remove': 'Remover',
    'common.update': 'Atualizar',
    'common.loading': 'Carregando...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'pt'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}