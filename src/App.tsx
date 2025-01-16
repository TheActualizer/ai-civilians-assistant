import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './integrations/supabase/client';
import { ToolbarStyleProvider } from './contexts/ToolbarStyleContext';
import { MainLayout } from './components/layouts/MainLayout';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ToolbarStyleProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </ToolbarStyleProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;