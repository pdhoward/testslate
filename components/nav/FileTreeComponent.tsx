import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeData, FileTreeItemSelected } from "@/context/useTreeData";
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import {CustomTreeItem} from '@/components/nav/filetreestyle/CustomTreeItem'

//  STRUCTURE OF FILETREEITEMSELECTED FROM CONTEXT
// type FileTreeItemSelected = {
//   itemIndex: string;  // set to sha from github
//   itemName: string;   // name of item .. ie cpy (directory) or cocom01y.cpy
//   itemId: string;     // path to item
//   itemLabel: string;  // full github http path to item  
//   itemType: string;   // file, blob, tree, etc
// };

export type GithubData = TreeViewBaseItem<{
  id: string;
  name: string;
  label: string;
  sha: string;
  disabled?: boolean;
  type: "tree" | "file" | "submodule" | "symlink" | "blob";
  children?: GithubData[];
}>;

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

export const FileTreeComponent = () =>  {
  const { treeData, updateFileTreeItemSelected } = useTreeData();  
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedItemObj, setSelectedItemObj] = useState<GithubData | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemIndex: string } | null>(null);

  const apiRef = useTreeViewApiRef();

  const findItemById = (items: GithubData[], id: string): GithubData | null => {
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
      const foundSelectedItem = findItemById(treeData, itemId);
      if (foundSelectedItem) {
        //setSelectedItemObj(selectedItem);    
       
        const fileTreeItemSelected: FileTreeItemSelected = {
          itemIndex: foundSelectedItem.sha,
          itemName: foundSelectedItem.name,
          itemId: itemId,
          itemLabel: foundSelectedItem.label,           
          itemType: foundSelectedItem.type

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
 
  const getItemId = (item: GithubData) => item.id;
  const getItemlabel = (item: GithubData) => item.name;
  const isItemDisabled = (item: GithubData) => !!item.disabled;

  return (
    <Stack spacing={2}>    
      <Box sx={{ 
        minHeight: 352, 
        minWidth: 250,
        maxHeight: '100vh',               
        }}
      >
        <RichTreeView
          items={treeData as GithubData[]}
          selectedItems={selectedItem}
          onSelectedItemsChange={handleSelectedItemsChange}
          getItemId={getItemId} 
          getItemLabel={getItemlabel} 
          isItemDisabled={isItemDisabled}  
          sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400 }}
          slots={{ item: CustomTreeItem }}
        />
      </Box>
     </Stack>
  );
}
