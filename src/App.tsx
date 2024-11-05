import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppContent } from './components/layout/AppContent';
import { Login } from './pages/Login';
import { useAuth } from './hooks/useAuth';

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <AppContent />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;