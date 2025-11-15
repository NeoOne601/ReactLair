import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearPage, updateStats } from '../../store/houseSlice';
import { BLOCK_TYPES } from '../../data/blockTypes';
import Button from '../shared/Button';
import BlockPalette from '../BlockPalette/BlockPalette';

/**
 * LegacyGaragePage
 * This is the page for building the "Garage".
 */
function LegacyGaragePage() {
  const dispatch = useDispatch();
  const pageId = 'GARAGE';
  const components = useSelector((state) => state.house.pages[pageId].components);

  // Update stats whenever this page's components change
  useEffect(() => {
    dispatch(updateStats());
  }, [components, dispatch]);

  const getBlockColor = (type) => {
    return BLOCK_TYPES.find(b => b.id === type)?.color || 'bg-gray-500';
  };

  return (
    <div className="flex flex-col gap-6">
      <BlockPalette />
      
      {/* Garage Build Area */}
      <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Garage</h2>
          <Button 
            variant="danger"
            onClick={() => dispatch(clearPage(pageId))} 
          >
            Clear Garage
          </Button>
        </div>
        
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg p-4 flex flex-wrap content-start gap-1 overflow-y-auto border-2 border-gray-400 dark:border-gray-600">
          {components.length === 0 && (
            <p className="text-gray-700 dark:text-gray-400 w-full text-center mt-4">
              Your garage is empty. Add some stone!
            </p>
          )}
          {components.map((block) => (
            <div
              key={block.id}
              className={`w-6 h-6 rounded-sm ${getBlockColor(block.type)} shadow-inner animate-flash`}
              title={block.type}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default LegacyGaragePage;
