import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  return <div className="toolbar bg-gray-800 p-2 rounded">{children}</div>;
};

interface ToolbarButtonProps {
  format: string;
  icon: string;
  onMouseDown: (event: React.MouseEvent) => void;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ format, icon, onMouseDown }) => {
  return (
    <button
      onMouseDown={onMouseDown}
      className="mr-2 text-white bg-gray-700 hover:bg-gray-600 p-2 rounded"
    >
      {icon}
    </button>
  );
};
