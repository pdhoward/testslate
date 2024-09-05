import { 
  Editor, 
  Text, 
  Transforms,
  Element as SlateElement
} from 'slate';
import { 
  CustomElement,
  TEXT_ALIGN_TYPES, 
  LIST_TYPES, 
  Align,
  List
} from './types';


export const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as Record<string, boolean> | null;
  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor: Editor, format: string, blockType: 'type' | 'align' = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  // Find nodes in the editor that match the block type or alignment
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: any) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (blockType === 'type'
          ? n.type === format  // Check block type
          : (n as CustomElement & { align?: Align }).align === format),
       // n[blockType] === format,  // Match by type or align based on blockType
    })
  );

  return !!match;  // Return true if a match is found, otherwise false
};


export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format as Align) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format as List);

  // Unwrap any existing lists, but avoid unwrapping for alignment changes
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type as List) &&
      !TEXT_ALIGN_TYPES.includes(format as Align), // Ensure alignment does not affect list unwrapping
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format as Align)) {
    // If format is an alignment option, set the align property
    newProperties = {
      align: isActive ? undefined : format as Align, // Clear alignment if already active
    };
  } else {
    // Otherwise, set the block type (e.g., list-item, paragraph, etc.)
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as CustomElement['type']),
    };
  }

  // Apply the new properties (either align or block type)
  Transforms.setNodes<SlateElement>(editor, newProperties);

  // If it's a list type and not active, wrap the items in a list block
  if (!isActive && isList) {
    const block = { type: format as List, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
