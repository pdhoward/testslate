import React, { forwardRef, PropsWithChildren, Ref, HTMLAttributes } from 'react';
import classNames from 'classnames'; // Using classNames for conditional class handling

interface BaseProps {
  className?: string;
}

interface ButtonProps extends BaseProps, HTMLAttributes<HTMLSpanElement> {
    active: boolean;
    reversed?: boolean;
  }

const Button = forwardRef<HTMLSpanElement, PropsWithChildren<ButtonProps>>(
  ({ className, active, reversed, ...props }, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={classNames(
          className,
          'cursor-pointer', // Basic cursor styling
          {
            'text-white': reversed && active,  // Active and reversed
            'text-gray-400': reversed && !active,  // Inactive and reversed
            'text-black': !reversed && active,  // Active and not reversed
            'text-gray-300': !reversed && !active,  // Inactive and not reversed
          }
        )}
      />
    );
  }
);
// Add the displayName for debugging
Button.displayName = 'Button';
export default Button;
