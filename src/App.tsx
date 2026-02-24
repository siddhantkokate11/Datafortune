import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './services/store';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;