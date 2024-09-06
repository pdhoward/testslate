import React from 'react';
import { RenderElementProps } from 'slate-react';

const DefaultElement: React.FC<RenderElementProps> = (props) => {
  // Apply styles for alignment (default to 'left' if not specified)
  const style = { textAlign: (props.element as any).align || 'left' };
  return (
    <p {...props.attributes} style={style}>
      {props.children}
    </p>
  )
};

export default DefaultElement;
