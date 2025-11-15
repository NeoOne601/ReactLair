import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../../store/houseSlice';
import Button from './Button';

const PAGES = [
  { id: 'GARDEN', name: 'Garden' },
  { id: 'HOUSE', name: 'House' },
  { id: 'GARAGE', name: 'Garage' },
];

/**
 * Renders navigation buttons and dispatches Redux actions to change the page.
 */
function PageNavigator() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.house.currentPage);

  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Navigation</h2>
      <div className="flex flex-col gap-2">
        {PAGES.map((page) => (
          <Button
            key={page.id}
            variant={currentPage === page.id ? 'primary' : 'secondary'}
            onClick={() => dispatch(setCurrentPage(page.id))}
          >
            {page.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}

export default PageNavigator;
