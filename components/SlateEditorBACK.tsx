"use client"
import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  createEditor,
  Descendant,
  BaseEditor,
  Node,
  Text,
  Transforms,
  Editor,
  Range,
  Element as SlateElement,
} from 'slate';
import { 
  Slate, 
  Editable, 
  withReact, 
  RenderElementProps, 
  RenderLeafProps, 
  ReactEditor,
  useSlate,
  useFocused
} from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { Toolbar, ToolbarButton } from './Toolbar';


// Define the custom CodeBlockElement type
type CodeBlockElement = {
  type: 'code';
  language: string;
  children: Descendant[];
};

type CustomText = { 
  text: string; 
  bold?: boolean; 
  italic?: boolean; 
  code?: boolean; 
  underlined?: boolean 
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CodeBlockElement | { type: 'paragraph'; children: Descendant[] } | { type: 'button'; children: Descendant[] };
    Text: CustomText;
  }
}

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

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      case 'button':
        return <ButtonElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
      case "u": {
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

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as Record<string, boolean> | null;
  return marks ? marks[format] === true : false;
};


const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const DefaultElement: React.FC<RenderElementProps> = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const CodeElement: React.FC<RenderElementProps> = (props) => {
  const text = props.children ? Node.string(props.element) : '';

  return (
    <SyntaxHighlighter language="cobol" style={codeStyle} className="bg-gray-800 text-white rounded p-4">
      {text}
    </SyntaxHighlighter>
  );
};

const ButtonElement: React.FC<RenderElementProps> = (props) => {
  const handleClick = () => {
    alert('Second Opinion Requested!');
  };

  return (
    <div {...props.attributes} contentEditable={false} className="my-4">
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Get Second Opinion
      </button>
      {props.children}
    </div>
  );
};

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  console.log(`-----------debug leaf-----------`)
  console.log(leaf)
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;  
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
};

const HoveringToolbar: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.style.opacity = '0';
      el.style.top = '-10000px';
      el.style.left = '-10000px';
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
    el.style.left = `${rect.left + window.scrollX - el.offsetWidth / 2 + rect.width / 2}px`;
    
  });

  return (
    <div
      ref={ref}
      className="p-2 absolute z-10 top-[-10000px] left-[-10000px] mt-[-6px] opacity-0 bg-gray-800 rounded transition-opacity duration-700"
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
       <FormatButton format="bold" icon={<FormatBoldIcon />} />
       <FormatButton format="italic" icon={<FormatItalicIcon />} />
       <FormatButton format="underlined" icon={<FormatUnderlinedIcon />} />
    </div>
  );
};

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

export default SlateEditor;
