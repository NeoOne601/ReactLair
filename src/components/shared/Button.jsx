import React from 'react';

/**
 * A reusable, theme-aware Button component.
 */
function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-semibold ' +
    'transition-all duration-200 ease-in-out ' +
    'focus:outline-none focus:ring-2 focus:ring-opacity-50 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white ' +
      'focus:ring-blue-500',
    secondary:
      'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 ' +
      'text-gray-800 dark:text-gray-100 focus:ring-blue-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white ' +
      'focus:ring-red-500',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
