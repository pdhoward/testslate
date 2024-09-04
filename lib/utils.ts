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

export const isBlockActive = (editor: Editor, format: string, blockType: 'type' | 'align') => {
  const { selection } = editor;
  if (!selection) return false;

  // Type guard - Check if an element has the `align` property
  const isAlignableElement = (element: CustomElement): element is CustomElement & { align?: Align } => {
    return 'align' in element;
    };

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n: any) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          (blockType === 'type'
            ? n.type === format
            : isAlignableElement(n) && n.align === format), // Check align only on elements that support it
      })
    );
  return !!match;
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
  // Determine whether we are toggling an align or type block
  const isAlignFormat = TEXT_ALIGN_TYPES.includes(format as Align);
  const isActive = isBlockActive(editor, format, isAlignFormat ? 'align' : 'type');
  const isList = LIST_TYPES.includes(format as List);
  // Type guard using the `List` type
  const isListType = (type: string): type is List => {
    return LIST_TYPES.includes(type as List); // Use the List type here
  };

   // Unwrap nodes for lists
   Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) && // Using the type guard here
      !TEXT_ALIGN_TYPES.includes(format as Align), // Ensure alignment doesn't affect list unwrapping
    split: true,
  });

  // Define newProperties as either align or type based on the format
  let newProperties: Partial<SlateElement> & { align?: string };
  
  if (isAlignFormat) {
    newProperties = {
      align: isActive ? undefined : (format as Align), // Use Align type here
    };
  } else {
    // Ensure `format` is one of the valid CustomElement types
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : (format as CustomElement['type']), // Toggle block type
    };
  }

   // Set the new properties (either align or type)
  Transforms.setNodes(editor, newProperties as Partial<SlateElement>);

 // Wrap list items in a parent list block
  if (!isActive && isList) {
    const block = { type: format as List, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
