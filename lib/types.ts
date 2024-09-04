import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Alignment and List types for text blocks
export type Align = 'left' | 'center' | 'right' | 'justify';
export type List = 'numbered-list' | 'bulleted-list'
// List and text alignment types used in the editor
export const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const

// Definition of different block types (Code, Paragraph, BlockQuote, etc.)
export type CodeBlockElement = {
  type: 'code';
  language: string;
  children: Descendant[];
};

export type ParagraphElement = {
  type: 'paragraph';
  align?: Align; // optional align property
  children: Descendant[];
};

// Elements with optional align property
export type AlignableElement = {
  align?: Align;
  children: Descendant[];
};

export type BlockQuoteElement = AlignableElement & {
  type: 'block-quote';
};

export type HeadingOneElement = AlignableElement & {
  type: 'heading-one';
};

export type HeadingTwoElement = AlignableElement & {
  type: 'heading-two';
};

// List item elements and list types
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

// Button elements for invoking custom AI requests or general button UI
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

// Defining text formatting properties (e.g., bold, italic)
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underlined?: boolean;
};

// Extending Slate types to include our custom elements and text
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement; // Using the refined CustomElement for all block types
    Text: CustomText;
  }
}
