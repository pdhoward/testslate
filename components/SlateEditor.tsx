"use client";
import React, { useCallback } from 'react';
import { 
  Slate,  
  Editable,   
  RenderElementProps, 
  RenderLeafProps 
} from 'slate-react';

import Element from '@/components/ui/Element'
import HoveringToolbar from '@/components/nav/HoveringToolbar';
import Toolbar from '@/components/nav/Toolbar';
import MarkButton from '@/components/ui/MarkButton';
import BlockButton from '@/components/ui/BlockButton';
import Leaf from '@/components/Leaf';
import { isMarkActive, toggleMark } from '../lib/utils';
import { useSlateContext } from '@/context/SlateContext'; // Import the context

const SlateEditor: React.FC = () => {
  const { editor, value, setValue } = useSlateContext(); // Use the context

  // element is the central hub for for handling various data and element types  
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

   // Custom leaf rendering (for inline formatting)
   const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  
  return (
    <div className="editor-container">
      <Slate 
        editor={editor} 
        initialValue={value} 
        onChange={newValue => setValue(newValue)
        }
      >
      <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Manage your content ..."
          spellCheck
          autoFocus
          className="m-4 p-4 bg-gray-500 rounded text-white"
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
