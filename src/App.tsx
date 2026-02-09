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
            
            {/* Everything inside MainLayout will have the Sidebar & Navbar */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<div>Order List Placeholder</div>} />
              
              {/* You can nest role-specific routes inside the layout too */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'waiter']} />}>
                <Route path="/food" element={<FoodMaster />} />
              </Route>
            </Route>

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}