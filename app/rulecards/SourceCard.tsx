import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { RuleFileData } from '@/lib/types';

type RuleDialogProps = {
  open: boolean;
  onClose: () => void;
  rule: RuleFileData;
};

const SourceCard: React.FC<RuleDialogProps> = ({ open, onClose, rule }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Extracted Business Rule</DialogTitle>
      <div className="dark:bg-gray-800 p-4">
        <SyntaxHighlighter language="cobol" style={a11yDark}>
          {rule.source ? rule.source.trim() : 'No source available'}
        </SyntaxHighlighter>
      </div>
    </Dialog>
  );
};

export default SourceCard;
