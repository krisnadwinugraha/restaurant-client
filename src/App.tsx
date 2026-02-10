import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout'; 

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FoodMaster from './pages/FoodMaster';
import OrderDetail from './pages/OrderDetail';
import OrderList from './pages/OrderList'; 

export default function App() {
  return (
    <NotificationProvider> 
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/food" element={<FoodMaster />} />
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </NotificationProvider>
  );
}