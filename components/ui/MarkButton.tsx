import React from 'react';
import { useSlate } from 'slate-react';
import Button from './Button';
import { isMarkActive } from '@/lib/utils';
import { toggleMark } from '@/lib/utils';  // We'll create this utility function next
import Icon from '@/components/icons/Icon'
import { TEXT_ALIGN_TYPES, Align } from '@/lib/types';

interface MarkButtonProps {
  format: string;
  icon: string | JSX.Element;
  editor: any; // Pass the editor directly
}

const MarkButton: React.FC<MarkButtonProps> = ({ format, icon, editor }) => {
  
  return (
    <Button
      active={isMarkActive(
        editor,
        format        
      )}
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default MarkButton;
