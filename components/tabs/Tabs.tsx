// components/tabs/Tabs.tsx
import React from 'react';

interface TabsProps {
  selectedTab: 'document' | 'code';
  setSelectedTab: (tab: 'document' | 'code') => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex space-x-2 border-b-2 border-gray-700">
      <button
        className={`p-3 px-6 rounded-t-md ${
          selectedTab === 'document' ? 'bg-gray-800 text-white border-t-2 border-l-2 border-r-2 border-gray-700' : 'bg-gray-900 text-gray-400'
        }`}
        onClick={() => setSelectedTab('document')}
      >
        Document Editor
      </button>
      <button
        className={`p-3 px-6 rounded-t-md ${
          selectedTab === 'code' ? 'bg-gray-800 text-white border-t-2 border-l-2 border-r-2 border-gray-700' : 'bg-gray-900 text-gray-400'
        }`}
        onClick={() => setSelectedTab('code')}
      >
        Code Editor
      </button>
    </div>
  );
};

export default Tabs;
