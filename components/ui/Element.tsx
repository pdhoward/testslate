import React from 'react';
import { RenderElementProps } from 'slate-react';
import { Node } from 'slate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CustomElement, Align } from '@/lib/types';
import CodeElement from '@/components/ui/CodeElement';
import RequestElement from '@/components/ui/RequestElement';
import DefaultElement from '@/components/ui/DefaultElement';

const Element: React.FC<RenderElementProps> = (props) => {
    const { attributes, children, element } = props
    const customElement = element as CustomElement; 
    const style = { textAlign: (element as any).align as Align };

    console.log(`=======inside of element=======`)
    console.log(`attributes is ${JSON.stringify(attributes)}, element is ${JSON.stringify(element)}`)
    console.log(`style is ${JSON.stringify(style)}`)
  
  switch (customElement.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'code':
      return <CodeElement {...props} />
    case 'request':
      return <RequestElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
};

export default Element;
