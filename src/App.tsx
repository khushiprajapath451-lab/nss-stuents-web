import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { User, users } from '@/lib/mockData';

const queryClient = new QueryClient();

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header
            user={currentUser ? { name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar } : null}
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
                  <Dashboard user={currentUser} />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
