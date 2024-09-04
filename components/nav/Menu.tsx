import React, { forwardRef, PropsWithChildren, Ref } from 'react';
import cx from 'classnames';

interface BaseProps {
  className?: string;
}

type OrNull<T> = T | null;

const Menu = forwardRef<HTMLDivElement, PropsWithChildren<BaseProps>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        {...props}
        data-test-id="menu"
        ref={ref}
        className={cx(
          className,
          'space-x-4' // Tailwind utility to add margin between elements (replacing custom margin logic)
        )}
      >
        {/* Children elements */}
      </div>
    );
  }
);

export default Menu;
