import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/BlogList';
import BlogForm from './pages/BlogForm';
import Comments from './pages/Comments';
import Settings from './pages/Settings';
import BannerManager from './pages/BannerManager';
import ServiceManager from './pages/Servicemanager';
import ServiceForm from './pages/Serviceform';
import EventManager from './pages/Eventmanager'; // ← NEW

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/new" element={<BlogForm />} />
            <Route path="blogs/edit/:id" element={<BlogForm />} />
            <Route path="comments" element={<Comments />} />
            <Route path="settings" element={<Settings />} />
             {/* ← NEW banner route */}
          <Route path="banner" element={<BannerManager />} />

          {/* ↓ NEW SERVICE ROUTES */}
        <Route path="services"           element={<ServiceManager />} />
        <Route path="services/new"       element={<ServiceForm />} />
        <Route path="services/edit/:id"  element={<ServiceForm />} />
        <Route path="/events"    element={<EventManager />} /> {/* ← NEW events route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
