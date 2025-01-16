import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './integrations/supabase/client';
import { ToolbarStyleProvider } from './contexts/ToolbarStyleContext';
import { MainLayout } from './components/layouts/MainLayout';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import { PageBuilder } from './components/PageBuilder/PageBuilder';
import VideoSynthesis from './pages/VideoSynthesis';
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
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/page-builder" element={<PageBuilder />} />
                <Route path="/video-synthesis" element={<VideoSynthesis />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </ToolbarStyleProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;