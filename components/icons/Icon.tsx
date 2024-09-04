import React, { forwardRef, PropsWithChildren, Ref } from 'react';
import classNames from 'classnames'; // For dynamic class handling

interface BaseProps {
  className?: string;
}

const Icon = forwardRef<HTMLSpanElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={classNames(
          'material-icons', // Material Icons class
          'text-base align-text-bottom', // Tailwind equivalent of 'font-size: 18px' and 'vertical-align: text-bottom'
          className // Any additional classes passed as props
        )}
      />
    );
  }
);

export default Icon;
