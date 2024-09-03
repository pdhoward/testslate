import React from 'react';
import { RenderElementProps } from 'slate-react';
import { Node } from 'slate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeElement: React.FC<RenderElementProps> = (props) => {
  const text = props.children ? Node.string(props.element) : '';
  return (
    <SyntaxHighlighter language="cobol" style={codeStyle} className="bg-gray-800 text-white rounded p-4">
      {text}
    </SyntaxHighlighter>
  );
};

export default CodeElement;
