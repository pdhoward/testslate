import React from 'react';
import { RenderElementProps } from 'slate-react';

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

export default ButtonElement;
