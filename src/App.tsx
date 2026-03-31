import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import InviteLanding from './pages/InviteLanding';
import NotFound from './pages/NotFound';
import { DbProfile, dbProfileToUser } from '@/lib/supabaseData';

const queryClient = new QueryClient();

// Legacy User type for components
export type User = ReturnType<typeof dbProfileToUser>;

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);

  const handleLogin = (profile: DbProfile) => {
    setDbProfile(profile);
    setCurrentUser(dbProfileToUser(profile));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setDbProfile(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header
            user={currentUser ? { name: currentUser.name, rollNumber: currentUser.rollNumber, avatar: currentUser.avatar } : null}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/auth"
              element={
                currentUser ? <Navigate to="/dashboard" replace /> : <Auth onLogin={handleLogin} />
              }
            />
            <Route
              path="/dashboard"
              element={
                currentUser ? (
                  <Dashboard user={currentUser} dbProfile={dbProfile!} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route path="/invite/:code" element={<InviteLanding onLogin={handleLogin} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
