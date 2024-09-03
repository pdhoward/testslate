import React from 'react';
import SlateEditor from '@/components/SlateEditor';

const TestPlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Test Plan</h1>
      <SlateEditor />
    </div>
  );
};

export default TestPlanPage;
