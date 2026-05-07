import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import FindingsExplorer from './pages/FindingsExplorer';
import AuditTrail from './pages/AuditTrail';
import RulesManager from './pages/RulesManager';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/findings" element={<AppLayout><FindingsExplorer /></AppLayout>} />
          <Route path="/audit" element={<AppLayout><AuditTrail /></AppLayout>} />
          <Route path="/rules" element={<AppLayout><RulesManager /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
