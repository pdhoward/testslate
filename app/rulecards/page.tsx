"use client";
import React from 'react';
import SubscriptionGrid from './SubscriptionGrid';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-start justify-center">
      <SubscriptionGrid />
    </div>
  );
};

export default HomePage;

