import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './layouts/MobileLayout';
import { EntryPage } from './pages/mobile/EntryPage';
import { ListPage } from './pages/mobile/ListPage';
import { AdminPage } from './pages/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mobile View Routes */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={<EntryPage />} />
          <Route path="/list" element={<ListPage />} />
        </Route>
        
        {/* Admin View Routes */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
