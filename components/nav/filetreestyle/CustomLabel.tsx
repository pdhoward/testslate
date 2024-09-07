import React from 'react';
import { styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TreeItem2Label } from '@mui/x-tree-view/TreeItem2';
import { DotIcon } from './DotIcon';

// Renders the label of a tree item with an optional icon and 
// expandable dot indicator.

interface CustomLabelProps {
    children: React.ReactNode;       // The content to display inside the label.
    icon?: React.ElementType;        // Optional icon to display next to the label.
    expandable?: boolean;            // Indicates if the item is expandable (i.e., if it has children).
    [key: string]: any;              // Allows passing any additional props.
  }

const StyledTreeItemLabelText = styled(Typography)({
    color: 'inherit',
    fontFamily: 'General Sans',
    fontWeight: 500,
  }) as unknown as typeof Typography;

export const CustomLabel = ({
    icon: Icon,
    expandable,
    children,
    ...other
  }: CustomLabelProps) => {
    return (
      <TreeItem2Label
        {...other}
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {Icon && (
          <Box
            component={Icon}
            className="labelIcon"
            color="inherit"
            sx={{ mr: 1, fontSize: '1.2rem' }}
          />
        )}
  
        <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
        {expandable && <DotIcon />}
      </TreeItem2Label>
    );
  }
