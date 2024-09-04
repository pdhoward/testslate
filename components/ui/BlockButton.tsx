import React from 'react';
import { useSlate } from 'slate-react';
import Button from './Button'
import { isBlockActive } from '@/lib/utils';
import { toggleBlock } from '@/lib/utils';  // We'll create this utility function next
import { TEXT_ALIGN_TYPES, Align } from '@/lib/types';
import Icon from '@/components/icons/Icon'

const BlockButton: React.FC<{ format: string; icon: JSX.Element }> = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format as Align) ? 'align' : 'type'
      )}
      onMouseDown={(event: any) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

export default BlockButton;
