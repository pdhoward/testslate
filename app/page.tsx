import React from 'react';
import SlateEditor from '@/components/SlateEditor';

const TestPlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Sidebar</h2>
        {/* Sidebar content goes here */}
        <ul>
          <li className="mb-4">Menu Item 1</li>
          <li className="mb-4">Menu Item 2</li>
          <li className="mb-4">Menu Item 3</li>
          <li className="mb-4">Menu Item 4</li>
        </ul>
      </aside>

      {/* Main content - Editor */}
      <main className="w-4/5 p-6">
        <div className="editor-container h-full bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          <h1 className="text-lg font-bold mb-8">Edit Test Plan</h1>
          <SlateEditor />
        </div>
      </main>
    </div>
  );
};

export default TestPlanPage;
