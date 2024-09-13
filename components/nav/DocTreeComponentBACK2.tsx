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
