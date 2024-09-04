import React, { forwardRef, PropsWithChildren, Ref } from 'react';
import cx from 'classnames';
import Menu from '@/components/nav/Menu'; // Import the Menu component

interface BaseProps {
  className?: string;
}

type OrNull<T> = T | null;

const Toolbar = forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => {
    return (
      <Menu
        {...props}
        ref={ref}
        className={cx(
          className,
          'relative px-4 py-2 border-b-2 border-gray-600 mb-5' // Tailwind classes for styling
        )}
      >
        {/* Add any toolbar-specific elements here, like buttons or icons */}
      </Menu>
    );
  }
);

export default Toolbar;
