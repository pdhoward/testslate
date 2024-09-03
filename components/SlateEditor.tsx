"use client";
import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Descendant, Text, Transforms } from 'slate';
import { 
  Slate, 
  Editable, 
  withReact, 
  RenderElementProps, 
  RenderLeafProps 
} from 'slate-react';
import { withHistory } from 'slate-history';
import Element from '@/components/ui/Element'
import HoveringToolbar from '@/components/nav/HoveringToolbar';
import Leaf from '@/components/Leaf';
import { isMarkActive, toggleMark } from '../lib/utils';

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'This is a test plan for the COBOL program.' }] },
  {
    type: 'code',
    language: 'javascript',
    children: [{ text: 'const x = 10;\nconsole.log(x);' }],
  },
  {
    type: 'button',
    children: [{ text: '' }],
  },
];

const SlateEditor: React.FC = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // element is the central hub for for handling all the different data
  // and element types in the editor
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  // leaf is used by the hover menu to apply styling
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey) {
      return;
    }

    switch (event.key) {
      case '`': {
        event.preventDefault();
        const isActive = isMarkActive(editor, 'code');
        Transforms.setNodes(
          editor,
          { code: !isActive },
          { match: (n) => Text.isText(n), split: true }
        );
        break;
      }
      case 'b': {
        event.preventDefault();
        toggleMark(editor, 'bold');
        break;
      }
      case 'i': {
        event.preventDefault();
        toggleMark(editor, 'italic');
        break;
      }
      case 'u': {
        event.preventDefault();
        toggleMark(editor, 'underlined');
        break;
      }
    }
  };

  return (
    <div className="editor-container">
      <Slate editor={editor} initialValue={value} onChange={(newValue) => setValue(newValue)}>
        <HoveringToolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Edit your test plan here..."
          onKeyDown={handleKeyDown}
          className="p-4 bg-gray-700 rounded text-white"
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
