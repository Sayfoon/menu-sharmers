import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import { Toaster } from '@/components/ui/use-toast';
import Register from './pages/Register';

function App() {
  // You can add state or other logic here if needed

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes as needed */}
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
