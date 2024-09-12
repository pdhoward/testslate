import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useMetaData, FileTreeItemSelected } from "@/context/useMetaData";
import {CustomTreeItem} from '@/components/nav/doctreestyle/CustomTreeItem'
import { MetaFileData } from '@/context/useMetaData';


//  STRUCTURE OF FILETREEITEMSELECTED FROM CONTEXT
// type FileTreeItemSelected = {
//   itemIndex: string;  // set to sha from github
//   itemName: string;   // name of item .. ie cpy (directory) or cocom01y.cpy
//   itemId: string;     // path to item
//   itemLabel: string;  // full github http path to item  
//   itemType: string;   // file, blob, tree, etc
// };

//  STRUCTURE OF DOCTREEITEMSELECTED FROM CONTEXT
// type DocTreeItemSelected = {
//   itemIndex: string;  // set to Object(_id) from mongo
//   itemName: string;   // name of item .. ie cpy (directory) or cocom01y.cpy
//   itemId: string;     // path to item
//   itemLabel: string;  // full github http path to item  
//   itemType: string;   // file, blob, tree, etc
// };

export type DocData = TreeViewBaseItem<{
  id: string;
  name: string;
  label: string;
  sha: string;
  disabled?: boolean;
  type: 'image' | 'pdf' | 'doc' | 'video' | 'folder' | 'pinned' | 'trash' | 'file';
  children?: DocData[];
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
