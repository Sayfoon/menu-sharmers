
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import { Toaster } from '@/components/ui/toaster';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RestaurantProfile from './pages/RestaurantProfile';
import MenuSections from './pages/MenuSections';
import MenuItems from './pages/MenuItems';
import Menu from './pages/Menu';

function App() {
  // You can add state or other logic here if needed

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<RestaurantProfile />} />
        <Route path="/sections" element={<MenuSections />} />
        <Route path="/items/:sectionId" element={<MenuItems />} />
        <Route path="/menu" element={<Menu />} />
        {/* Add more routes as needed */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
