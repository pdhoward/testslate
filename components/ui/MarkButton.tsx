import React from 'react';
import { useSlate } from 'slate-react';
import Button from './Button';
import { isMarkActive } from '@/lib/utils';
import { toggleMark } from '@/lib/utils';  // We'll create this utility function next
import Icon from '@/components/icons/Icon'
import { TEXT_ALIGN_TYPES, Align } from '@/lib/types';

const MarkButton: React.FC<{ format: string; icon: string | JSX.Element  }> = ({ format, icon }) => {
  const editor = useSlate();
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
