import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobileLayout } from './layouts/MobileLayout';
import { EntryPage } from './pages/mobile/EntryPage';
import { ListPage } from './pages/mobile/ListPage';
import { AdminPage } from './pages/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login is disabled for the mini-program H5 flow. */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Mobile View Routes */}
        <Route element={
          <MobileLayout />
        }>
          <Route path="/" element={<EntryPage />} />
          <Route path="/list" element={<ListPage />} />
        </Route>
        
        {/* Admin remains reachable directly for now, without blocking property entry. */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
