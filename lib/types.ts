import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CodeBlockElement = {
  type: 'code';
  language: string;
  children: Descendant[];
};

export type CustomText = { 
  text: string; 
  bold?: boolean; 
  italic?: boolean; 
  code?: boolean; 
  underlined?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CodeBlockElement | { type: 'paragraph'; children: Descendant[] } | { type: 'button'; children: Descendant[] };
    Text: CustomText;
  }
}
