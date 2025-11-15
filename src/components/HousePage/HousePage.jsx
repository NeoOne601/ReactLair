import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearPage, updateStats } from '../../store/houseSlice';
import { BLOCK_TYPES } from '../../data/blockTypes';
import Button from '../shared/Button';
import BlockPalette from '../BlockPalette/BlockPalette';

/**
 * HousePage
 * This is the page for building the "House".
 * It includes the build area and stats.
 */
function HousePage() {
  const dispatch = useDispatch();
  const pageId = 'HOUSE';
  
  // Select state for *this* page
  const components = useSelector((state) => state.house.pages[pageId].components);
  // Select global stats
  const { totalBlocks, totalCost } = useSelector((state) => state.house.stats);

  // Update stats whenever this page's components change
  useEffect(() => {
    dispatch(updateStats());
  }, [components, dispatch]);

  const getBlockColor = (type) => {
    return BLOCK_TYPES.find(b => b.id === type)?.color || 'bg-gray-500';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Palette is also available here */}
      <BlockPalette />
      
      {/* House Build Area */}
      <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your House</h2>
          <Button 
            variant="danger"
            onClick={() => dispatch(clearPage(pageId))} 
          >
            Clear House
          </Button>
        </div>
        
        <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg p-4 flex flex-wrap content-start gap-1 overflow-y-auto border-2 border-gray-400 dark:border-gray-600">
          {components.length === 0 && (
            <p className="text-gray-700 dark:text-gray-400 w-full text-center mt-4">
              Your house is empty. Add some bricks and wood!
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

      {/* Global Stats Display */}
      <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Project Stats (All Pages)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-500">{totalBlocks}</div>
            <div className="text-sm">Total Blocks</div>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-500">${totalCost}</div>
            <div className="text-sm">Total Cost</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HousePage;
