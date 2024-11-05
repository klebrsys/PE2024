import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Companies } from '../../pages/Companies';
import { Users } from '../../pages/Users';
import { Settings } from '../../pages/Settings';
import { Vision } from '../../pages/Vision';
import { Mission } from '../../pages/Mission';
import { Values } from '../../pages/Values';
import { Perspectivas } from '../../pages/Perspectivas';
import { Goals } from '../../pages/Goals';
import { Objectives } from '../../pages/Objectives';
import { ActionPlans } from '../../pages/ActionPlans';
import { Swot } from '../../pages/Swot';
import { StrategicMap } from '../../pages/StrategicMap';
import { StrategicOverview } from '../../pages/StrategicOverview';
import { useAuth } from '../../hooks/useAuth';

export function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  
  const renderContent = () => {
    switch (currentPage) {
      case 'companies':
        return <Companies />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'strategic-overview':
        return <StrategicOverview />;
      case 'vision':
        return <Vision />;
      case 'mission':
        return <Mission />;
      case 'values':
        return <Values />;
      case 'perspectivas':
        return <Perspectivas />;
      case 'goals':
        return <Goals />;
      case 'objectives':
        return <Objectives />;
      case 'action-plans':
        return <ActionPlans />;
      case 'swot':
        return <Swot />;
      case 'strategic-map':
        return <StrategicMap />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome to Enterprise Hub</h1>
            <p className="mt-2 text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={setCurrentPage} />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}