import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

// types for the metafile definition
export type DocumentType = 'image' | 'pdf' | 'text' | 'video' | 'folder' | 'file' | 'tree' | 'submodule' | 'symlink' | 'blob';
export type ArtifactType = 'meta' | 'insights' | 'process' | 'stories' | 'notes' | 'charts' | 'tests' | 'code' | 'rules' | 'data' | 'prompts' | 'repo' | 'github' | 'discard' | 'pinned' | 'scope';

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

// interfaces/documents.ts
export interface Document {
  id: string;
  title: string;
  type: string; // e.g., business-process, rules, stories, etc.
  content: string;
}


// MetaFileData type for migratedb meta data collection
export type MetaFileData = TreeViewBaseItem<{
  _id: string;
  id: string;
  sha: string;
  org: string;
  project: string;
  application: string;
  path: string;
  name: string;
  html_url: string | null;
  documentType: DocumentType
  label: string;
  artifactType: ArtifactType
  isDeleted: boolean;
  createdOn: Date;
  updatedOn: Date;
  approvedOn: Date | null;
  createdBy: string;
  updatedBy: string;
  approvedBy: string | null;
  size: number | null;
  extension: string | null;
  description: string | null;
  tags: string[];
  usedInProcess: string[];
  inScope: boolean,
  isPinned: boolean;
  children?: MetaFileData[];
}>;

export type DocFileData = TreeViewBaseItem<{  
  id: string;  
  org: string;
  project: string;
  application: string;
  path: string;
  name: string;
  label: string;
  documentType: string;
  artifactType: string;
} & Record<string, unknown>>;


