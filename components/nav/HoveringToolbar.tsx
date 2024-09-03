import React, { useEffect, useRef } from 'react';
import { useSlate, useFocused } from 'slate-react';
import { Range, Editor } from 'slate';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatButton from '@/components/ui/FormatButton';

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
        e.preventDefault();
      }}
    >
       <FormatButton format="bold" icon={<FormatBoldIcon />} />
       <FormatButton format="italic" icon={<FormatItalicIcon />} />
       <FormatButton format="underlined" icon={<FormatUnderlinedIcon />} />
    </div>
  );
};

export default HoveringToolbar;
