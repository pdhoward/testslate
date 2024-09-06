"use client";
import React, { useMemo, useState, useCallback } from 'react';
import { Editor, createEditor, Descendant, Text, Transforms } from 'slate';
import { 
  Slate,
  useSlate,
  Editable, 
  withReact, 
  RenderElementProps, 
  RenderLeafProps 
} from 'slate-react';
import { withHistory } from 'slate-history';
import Element from '@/components/ui/Element'
import HoveringToolbar from '@/components/nav/HoveringToolbar';
import Toolbar from '@/components/nav/Toolbar';
import MarkButton from '@/components/ui/MarkButton';
import BlockButton from '@/components/ui/BlockButton';
import Leaf from '@/components/Leaf';
import { isMarkActive, toggleMark } from '../lib/utils';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text: ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

const SlateEditor: React.FC = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // element is the central hub for for handling various data and element types  
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
        
        <Toolbar>
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />
          <BlockButton format="justify" icon="format_align_justify" />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Manage your content ..."
          spellCheck
          autoFocus
          onKeyDown={handleKeyDown}
          className="m-4  p-4 bg-gray-500 rounded text-white focus-within:outline focus-within:outline-green-600 focus-within:outline-2 focus-within:px-[16px]"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
      </Slate>
    </div>
  );
};

export default SlateEditor;
