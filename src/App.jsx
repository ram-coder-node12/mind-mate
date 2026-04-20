import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DailyCheckIn from './pages/DailyCheckIn';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

// Lazy loaded pages
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppDataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/check-in" element={
              <ProtectedRoute>
                <AppShell>
                  <DailyCheckIn />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute>
                <AppShell>
                  <Tasks />
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute>
                <AppShell>
                  <Suspense fallback={
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                      <p>Loading Analytics...</p>
                    </div>
                  }>
                    <Analytics />
                  </Suspense>
                </AppShell>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AppShell>
                  <Profile />
                </AppShell>
              </ProtectedRoute>
            } />
          </Routes>
        </AppDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
