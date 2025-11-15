import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';

/**
 * A button to toggle light and dark mode.
 */
function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="secondary" className="p-2">
      {isDarkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536a1 1 0 00-1.414-1.414l-1.06 1.06a1 1 0 001.413 1.414l1.06-1.06zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.536-.464a1 1 0 00-1.414 1.414l1.06 1.06a1 1 0 001.414-1.414l-1.06-1.06zM3 10a1 1 0 01-1-1H1a1 1 0 110-2h1a1 1 0 011 1zm1.06-4.536a1 1 0 001.414-1.414l-1.06-1.06a1 1 0 00-1.414 1.414l1.06 1.06z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </Button>
  );
}

export default ThemeToggleButton;
