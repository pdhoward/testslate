import React from 'react';

interface TabsProps {
  selectedTab: 'document' | 'code' | 'ai';
  setSelectedTab: (tab: 'document' | 'code' | 'ai') => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="flex space-x-2 border-b-2 border-gray-700">
      <button
        className={`py-2 px-4 text-sm rounded-t-md ${
          selectedTab === 'document'
            ? 'bg-gray-800 text-white border-t-2 border-l-2 border-r-2 border-gray-700'
            : 'bg-gray-900 text-gray-400'
        }`}
        onClick={() => setSelectedTab('document')}
      >
        UX
      </button>
      <button
        className={`py-2 px-4 text-sm rounded-t-md ${
          selectedTab === 'code'
            ? 'bg-gray-800 text-white border-t-2 border-l-2 border-r-2 border-gray-700'
            : 'bg-gray-900 text-gray-400'
        }`}
        onClick={() => setSelectedTab('code')}
      >
        DX
      </button>
      <button
        className={`py-2 px-4 text-sm rounded-t-md ${
          selectedTab === 'ai'
            ? 'bg-gray-800 text-white border-t-2 border-l-2 border-r-2 border-gray-700'
            : 'bg-gray-900 text-gray-400'
        }`}
        onClick={() => setSelectedTab('ai')}
      >
        AI
      </button>
    </div>
  );
};

export default Tabs;
