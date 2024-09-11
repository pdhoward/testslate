import { styled } from '@mui/material/styles';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { TreeItem2Root } from '@mui/x-tree-view/TreeItem2';

// Customizes the styling for each tree item root, including 
// indentation and color settings.

export const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
    position: 'relative',
    paddingLeft: theme.spacing(2), // Add padding to create indentation
    '& .MuiTreeItem-group': { // Target the children container
      marginLeft: theme.spacing(2), // Indent the children
    },
    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: theme.spacing(2), // indentation for children
    },
  })) as unknown as typeof TreeItem2Root;