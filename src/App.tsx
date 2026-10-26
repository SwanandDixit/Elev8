import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Layouts & Components
import Layout from './components/layout/Layout';

// Public Pages
import Home from './pages/Home';
import FindWork from './pages/FindWork';
import BrowseWorkers from './pages/BrowseWorkers';
import WorkerProfile from './pages/WorkerProfile';
import PostRequirement from './pages/PostRequirement';
import RegisterWorker from './pages/RegisterWorker';
import Certifications from './pages/Certifications';
import About from './pages/About';

// Auth
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';

// Dashboards
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminPanel from './pages/AdminPanel';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, role, initialized } = useAuthStore();
  
  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-[#1A56DB] text-4xl">⟳</div></div>;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect based on actual role if trying to access wrong dashboard
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'employer') return <Navigate to="/dashboard/employer" replace />;
    return <Navigate to="/dashboard/worker" replace />;
  }
  
  return <>{children}</>;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, role, initialized } = useAuthStore();
  
  if (!initialized) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-[#1A56DB] text-4xl">⟳</div></div>;
  if (user) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'employer') return <Navigate to="/dashboard/employer" replace />;
    return <Navigate to="/dashboard/worker" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Auth routes (no layout) */}
          <Route path="/sign-in" element={<AuthRoute><SignIn /></AuthRoute>} />
          <Route path="/sign-up" element={<AuthRoute><SignUp /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

          {/* Dashboard routes (have their own layouts) */}
          <Route path="/dashboard/worker" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/employer" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Public routes (with standard layout) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/find-work" element={<FindWork />} />
            <Route path="/browse-workers" element={<BrowseWorkers />} />
            <Route path="/worker/:id" element={<WorkerProfile />} />
            <Route path="/post-requirements" element={<PostRequirement />} />
            <Route path="/register-worker" element={<RegisterWorker />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/about" element={<About />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
