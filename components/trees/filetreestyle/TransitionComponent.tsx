import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { TransitionProps } from '@mui/material/transitions';
import Collapse from '@mui/material/Collapse';

const AnimatedCollapse = animated(Collapse);

// Handles the animated transition of tree item collapse/expand 
// using react-spring.

export const TransitionComponent = (props: TransitionProps) => {
    const style = useSpring({
      to: {
        opacity: props.in ? 1 : 0,
        transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
      },
    });  
    return <AnimatedCollapse style={style} {...props} />;
  };