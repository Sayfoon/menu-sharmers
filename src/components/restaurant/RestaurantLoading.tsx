
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RestaurantLoading = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <p className="text-center">Loading restaurant data...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantLoading;
