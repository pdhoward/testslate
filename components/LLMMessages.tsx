// components/LLMMessagePanel.tsx
import React from 'react';

const LLMMessagePanel: React.FC = () => {
  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">LLM Messages</h2>
      <div className="overflow-auto h-full">
        {/* Mocked messages */}
        <div className="bg-gray-600 p-3 mb-2 rounded">LLM message #1</div>
        <div className="bg-gray-600 p-3 mb-2 rounded">LLM message #2</div>
      </div>
    </div>
  );
};

export default LLMMessagePanel;
