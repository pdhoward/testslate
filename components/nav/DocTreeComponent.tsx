import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useMetaData, FileTreeItemSelected } from "@/context/useMetaData";
import {CustomTreeItem} from '@/components/nav/doctreestyle/CustomTreeItem'


// MetaFileData type for migratedb meta data collection
export type MetaFileData = TreeViewBaseItem<{
  _id: string;
  id: string;
  sha: string;
  path: string;
  name: string;
  html_url: string | null;
  type: 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash' | 'file' | 'tree' | 'submodule' | 'symlink' | 'blob';
  label: string;
  artifactType: 'meta' | 'docs' | 'stories' | 'notes' | 'charts' | 'tests' | 'code' | 'rules' | 'datamap';
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
  isPinned: boolean;
  children?: MetaFileData[];
}>;


type FileType = 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash';

type ExtendedTreeItemProps = {
  fileType?: FileType;
  id: string;
  label: string;
}; 

const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    label: 'Documents',
    children: [
      {
        id: '1.1',
        label: 'Company',
        children: [
          { id: '1.1.1', label: 'Invoice', fileType: 'pdf' },
          { id: '1.1.2', label: 'Meeting notes', fileType: 'doc' },
          { id: '1.1.3', label: 'Tasks list', fileType: 'doc' },
          { id: '1.1.4', label: 'Equipment', fileType: 'pdf' },
          { id: '1.1.5', label: 'Video conference', fileType: 'video' },
        ],
      },
      { id: '1.2', label: 'Personal', fileType: 'folder' },
      { id: '1.3', label: 'Group photo', fileType: 'image' },
    ],
  },
  {
    id: '2',
    label: 'Bookmarked',
    fileType: 'pinned',
    children: [
      { id: '2.1', label: 'Learning materials', fileType: 'folder' },
      { id: '2.2', label: 'News', fileType: 'folder' },
      { id: '2.3', label: 'Forums', fileType: 'folder' },
      { id: '2.4', label: 'Travel documents', fileType: 'pdf' },
    ],
  },
  { id: '3', label: 'History', fileType: 'folder' },
  { id: '4', label: 'Trash', fileType: 'trash' },
];

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}


export default function FileExplorer() {
  const { metaData, updateFileTreeItemSelected } = useMetaData(); 

  const getItemId = (item: MetaFileData) => item._id
  const getItemlabel = (item: MetaFileData) => item.name;
  const isItemDisabled = (item: MetaFileData) => !!item.isDeleted;
  return (
    <Stack spacing={2}>    
      <Box sx={{ 
        minHeight: 352, 
        minWidth: 250,
        maxHeight: '100vh',               
        }}
      >
        <RichTreeView
          items={metaData as MetaFileData[]} 
          getItemId={getItemId} 
          getItemLabel={getItemlabel}          
          sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          slots={{ item: CustomTreeItem }}
        />
     </Box>
  </Stack>
  );
}
