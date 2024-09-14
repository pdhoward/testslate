import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useMetaData, FileTreeItemSelected } from "@/context/useMetaData";
import {CustomTreeItem} from '@/components/nav/doctreestyle/CustomTreeItem'
import { DocumentType, ArtifactType } from '@/lib/types';

// MetaFileData type for migratedb meta data collection
export type MetaFileData = TreeViewBaseItem<{
  _id: string;
  id: string;
  sha: string;
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
  const [selectedItem, setSelectedItem] = useState<string>('');

  const findItemById = (items: MetaFileData[], id: string): MetaFileData | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleSelectedItemsChange = (event: React.SyntheticEvent, itemId: string | null) => {

    console.log(`------inside of doctreecomponent -----`)
    console.log(itemId)
    console.log(metaData)
    if (itemId) {
      const foundSelectedItem = findItemById(metaData, itemId);
      console.log(foundSelectedItem)
      if (foundSelectedItem) {
        //setSelectedItemObj(selectedItem);    
       
        const fileTreeItemSelected: FileTreeItemSelected = {
          itemIndex: foundSelectedItem.sha,
          itemName: foundSelectedItem.name,
          itemId: itemId,
          itemLabel: foundSelectedItem.label,           
          itemDocumentType: foundSelectedItem.documentType,
          itemArtifactType: foundSelectedItem.artifactType

        };
        // file detected so notify context
        updateFileTreeItemSelected(fileTreeItemSelected);
        
        // set selected item SHA to pass to mui Tree
        if (foundSelectedItem.sha) {
          setSelectedItem(foundSelectedItem.sha);
        }
      }
    }
  };
 

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
          selectedItems={selectedItem}
          onSelectedItemsChange={handleSelectedItemsChange}
          getItemId={getItemId} 
          getItemLabel={getItemlabel}          
          sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
          slots={{ item: CustomTreeItem }}
        />
     </Box>
  </Stack>
  );
}
