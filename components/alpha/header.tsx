// components/Header.tsx
import React from 'react';
import { Editor, Transforms } from 'slate';
import { useSlate } from 'slate-react';
import { IconButton, Select, MenuItem, Box, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CodeIcon from '@mui/icons-material/Code';

interface CustomText {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    code?: boolean;
    // Adding this line allows indexing with any string
    [key: string]: any;
  }
type MarkType = "bold" | "italic" | "underlined" | "code";
 

const Header = () => {
  const editor = useSlate();

  const isMarkActive = (editor: Editor, format: MarkType) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (editor: Editor, format: MarkType) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const renderIconButton = (icon: JSX.Element, format: MarkType) => (
    <IconButton
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      color={isMarkActive(editor, format) ? 'primary' : 'default'}
    >
      {icon}
    </IconButton>
  );

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="gray.200" p={2}>
      <Box display="flex" alignItems="center" gap={2}>
        {/* Text formatting icons */}
        {renderIconButton(<FormatBoldIcon />, 'bold')}
        {renderIconButton(<FormatItalicIcon />, 'italic')}
        {renderIconButton(<FormatUnderlinedIcon />, 'underlined')}
        {renderIconButton(<CodeIcon />, 'code')}

        {/* Headings */}
        <Button
          variant="outlined"
          onMouseDown={(event) => {
            event.preventDefault();
            Transforms.setNodes(editor, { type: 'heading-one' });
          }}
        >
          H1
        </Button>
        <Button
          variant="outlined"
          onMouseDown={(event) => {
            event.preventDefault();
            Transforms.setNodes(editor, { type: 'heading-two' });
          }}
        >
          H2
        </Button>
        

        {/* Lists */}
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            Transforms.setNodes(editor, { type: 'bulleted-list' });
          }}
        >
          <FormatListBulletedIcon />
        </IconButton>
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            Transforms.setNodes(editor, { type: 'numbered-list' });
          }}
        >
          <FormatListNumberedIcon />
        </IconButton>

        {/* Blockquote */}
        <IconButton
          onMouseDown={(event) => {
            event.preventDefault();
            Transforms.setNodes(editor, { type: 'block-quote' });
          }}
        >
          <FormatQuoteIcon />
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        {/* Type of writing, role, and feel */}
        <Select defaultValue="Type of writing">
          <MenuItem value="Type of writing">Type of writing</MenuItem>
          <MenuItem value="Article">Article</MenuItem>
        </Select>
        <Select defaultValue="Role in article">
          <MenuItem value="Role in article">Role in article</MenuItem>
          <MenuItem value="Author">Author</MenuItem>
        </Select>
        <Select defaultValue="Feel like">
          <MenuItem value="Feel like">Feel like</MenuItem>
          <MenuItem value="Informative">Informative</MenuItem>
        </Select>
      </Box>

      <Button variant="contained" color="secondary">
        AI
      </Button>
    </Box>
  );
};

export default Header;
