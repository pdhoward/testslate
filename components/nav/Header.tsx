import React from 'react';
import Toolbar from '@/components/nav/Toolbar';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 p-4 z-50 shadow-lg">
      <Toolbar />
    </header>
  );
};

export default Header;
