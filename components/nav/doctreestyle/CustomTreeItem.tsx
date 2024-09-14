import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'; // out of scope
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CommentIcon from '@mui/icons-material/Comment'; // insights
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import AnalyzeIcon from '@mui/icons-material/Topic' // rules
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'; // stories
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // business process
import BiotechIcon from '@mui/icons-material/Biotech'; // test
import DataObjectIcon from '@mui/icons-material/DataObject'; // data
import {
  unstable_useTreeItem2 as useTreeItem2,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view/useTreeItem2';
import {
  TreeItem2Checkbox, 
  TreeItem2IconContainer,  
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import {CustomLabel} from '@/components/nav/filetreestyle/CustomLabel'
import {TransitionComponent} from '@/components/nav/filetreestyle/TransitionComponent'
import {StyledTreeItemRoot} from '@/components/nav/filetreestyle/StyledTreeItemRoot'
import {CustomTreeItemContent} from '@/components/nav/filetreestyle/CustomTreeItemContent'
import { useTreeData } from '@/context/useTreeData';
import { DocumentType, ArtifactType } from '@/lib/types';

// A wrapper for each tree item, handling its state and appearance 
// based on its type and expandability.

interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

const isExpandable = (reactChildren: React.ReactNode) => {
    if (Array.isArray(reactChildren)) {
      return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
  };

// Returns the appropriate icon for a given file type and folder 
// state.
const getIconFromFileType = (fileType: DocumentType, artifactType: ArtifactType, isExpanded: boolean, isFolder: boolean) => {
    
    console.log(fileType, artifactType, isFolder, isExpanded)
    if (isFolder) {
      return isExpanded ? FolderOpenIcon : FolderRounded;
    }
    switch (fileType) {
      case 'image':
        return ImageIcon;
      case 'pdf':
        return PictureAsPdfIcon;
      case 'text':
        return ArticleIcon;
      case 'video':
        return VideoCameraBackIcon;    
      case 'blob':
        return FileIcon;      
      default:
        return ArticleIcon;
    }
  };
  
// A wrapper for each tree item, handling its state and appearance 
// based on its type and expandability.
export const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: CustomTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { itemId, label, disabled, children, ...other } = props;  
  const { fileTreeItemSelected, repoDetails, isRightClicked, updateIsRightClicked } = useTreeData();
 
  const handleRightClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();    
    updateIsRightClicked(true); // Update context with right-click status  
  };

  useEffect(() => {
    updateIsRightClicked(false); // Reset the right-click status when the item changes
  }, [fileTreeItemSelected.itemIndex]);
   
  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getCheckboxProps,
    getLabelProps,
    getGroupTransitionProps,
    getDragAndDropOverlayProps,
    status,
    publicAPI,
  } = useTreeItem2({ itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);  

  /////////////////////////////////////////////////////
  /// note that name and path are used to assign  ////
  //     specialized icons for the root process    //
  //////////////////////////////////////////////////
  
  const icon = getIconFromFileType(item.documentType, item.artifactType, status.expanded, expandable);
 
  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx('content', {
              'Mui-expanded': status.expanded,
              'Mui-selected': status.selected,
              'Mui-focused': status.focused,
              'Mui-disabled': status.disabled,
            }),
          })}
          onContextMenu={handleRightClick}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>
          <TreeItem2Checkbox {...getCheckboxProps()} />
          <CustomLabel
            {...getLabelProps({ icon, expandable: expandable && status.expanded })}
          />
          <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
       
      </StyledTreeItemRoot>
      
    </TreeItem2Provider>
  );
});
