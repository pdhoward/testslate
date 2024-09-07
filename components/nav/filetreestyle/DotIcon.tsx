import React, { useState } from 'react';
import Box from '@mui/material/Box';

// Renders a small dot icon used to indicate expanded tree directory

export const DotIcon = () => {
    return (
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '70%',
          bgcolor: 'warning.main',
          display: 'inline-block',
          verticalAlign: 'middle',
          zIndex: 1,
          mx: 1,
        }}
      />
    );
  }
