import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useMetaData, FileTreeItemSelected } from "@/context/useMetaData";
import {CustomTreeItem} from '@/components/trees/doctreestyle/CustomTreeItem'
import { DocFileData } from '@/lib/types';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

export default function FileExplorer() {
  const { metaData, updateFileTreeItemSelected } = useMetaData(); 
  const [selectedItem, setSelectedItem] = useState<string>('');

  const findItemById = (items: DocFileData[], id: string): DocFileData | null => {
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
   
    if (itemId) {
      const foundSelectedItem = findItemById(metaData, itemId);
      console.log(foundSelectedItem)
      if (foundSelectedItem) {     
       
        const fileTreeItemSelected: FileTreeItemSelected = {         
          itemOrg: foundSelectedItem.org,
          itemProject: foundSelectedItem.project,
          itemApplication: foundSelectedItem.application,
          itemPath: foundSelectedItem.path,
          itemName: foundSelectedItem.name,
          itemId: itemId,
          itemLabel: foundSelectedItem.label,           
          itemDocumentType: foundSelectedItem.documentType,
          itemArtifactType: foundSelectedItem.artifactType,         

        };
        // file detected so notify context
        updateFileTreeItemSelected(fileTreeItemSelected);
        
        // set selected item SHA to pass to mui Tree
        if (foundSelectedItem._id) {
          setSelectedItem(foundSelectedItem.id);
        }
      }
    }
  }; 

  const getItemId = (item: DocFileData) => item.id
  const getItemlabel = (item: DocFileData) => item.name;
  const isItemDisabled = (item: DocFileData) => !!item.isDeleted;
  return (
    <Stack spacing={2}>    
      <Box sx={{ 
        minHeight: 352, 
        minWidth: 250,
        maxHeight: '100vh',               
        }}
      >
        <RichTreeView
          items={metaData as DocFileData[]} 
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
