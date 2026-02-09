import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout'; // Import your new layout

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FoodMaster from './pages/FoodMaster';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route: No Layout needed here */}
          <Route path="/login" element={<Login />} />

          {/* All Protected Routes go inside the Gatekeeper (ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food" element={<FoodMaster />} />
              <Route path="/orders" element={<div>Order List Placeholder</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}