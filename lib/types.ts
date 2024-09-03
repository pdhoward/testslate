import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type Align = 'left' | 'center' | 'right' | 'justify';

export type CodeBlockElement = {
  type: 'code';
  language: string;
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

export type BlockQuoteElement = {
  type: 'block-quote';
  align?: Align;
  children: Descendant[];
};

export type HeadingOneElement = {
  type: 'heading-one';
  align?: Align;
  children: Descendant[];
};

export type HeadingTwoElement = {
  type: 'heading-two';
  align?: Align;
  children: Descendant[];
};

export type ListItemElement = {
  type: 'list-item';
  children: Descendant[];
};

export type BulletedListElement = {
  type: 'bulleted-list';
  children: Descendant[];
};

export type NumberedListElement = {
  type: 'numbered-list';
  children: Descendant[];
};

export type ButtonElement = {
  type: 'button';
  children: Descendant[];
};

// this is a custom button for invoking ai requests
export type RequestElement = {
  type: 'request';
  children: Descendant[];
};

export type CustomElement =
  | CodeBlockElement
  | ParagraphElement
  | BlockQuoteElement
  | HeadingOneElement
  | HeadingTwoElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement
  | ButtonElement
  | RequestElement;

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
