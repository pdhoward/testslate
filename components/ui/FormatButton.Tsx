import React from 'react';
import { useSlate } from 'slate-react';
import { toggleMark } from '@/lib/utils';  // We'll create this utility function next

const FormatButton: React.FC<{ format: string; icon: JSX.Element }> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <button
      className="text-white p-1"
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

export default FormatButton;
