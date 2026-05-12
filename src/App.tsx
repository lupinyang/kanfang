import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './layouts/MobileLayout';
import { EntryPage } from './pages/mobile/EntryPage';
import { ListPage } from './pages/mobile/ListPage';
import { AdminPage } from './pages/admin/AdminPage';
import { LoginDemoPage } from './pages/auth/LoginDemoPage';
import { UserSettingsDemoPage } from './pages/admin/UserSettingsDemoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mobile View Routes */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={<EntryPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/login-demo" element={<LoginDemoPage />} />
        </Route>
        
        {/* Admin View Routes */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users-demo" element={<UserSettingsDemoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
