import React from 'react';
import { useSlateContext } from '@/context/SlateContext';
import MarkButton from '@/components/ui/MarkButton';
import BlockButton from '@/components/ui/BlockButton';

const Toolbar: React.FC = () => {
  const { editor } = useSlateContext(); // Access the editor
  return (
    <div className="toolbar space-x-4">
      <MarkButton editor={editor} format="bold" icon="format_bold" />
      <MarkButton editor={editor} format="italic" icon="format_italic" />
      <MarkButton editor={editor} format="underline" icon="format_underlined" />
      <MarkButton editor={editor} format="code" icon="code" />
      <BlockButton editor={editor} format="heading-one" icon="looks_one" />
      <BlockButton editor={editor} format="heading-two" icon="looks_two" />
      <BlockButton editor={editor} format="block-quote" icon="format_quote" />
      <BlockButton editor={editor} format="numbered-list" icon="format_list_numbered" />
      <BlockButton editor={editor} format="bulleted-list" icon="format_list_bulleted" />
      <BlockButton editor={editor} format="left" icon="format_align_left" />
      <BlockButton editor={editor} format="center" icon="format_align_center" />
      <BlockButton editor={editor} format="right" icon="format_align_right" />
      <BlockButton editor={editor} format="justify" icon="format_align_justify" />
    </div>
  );
};

export default Toolbar;

