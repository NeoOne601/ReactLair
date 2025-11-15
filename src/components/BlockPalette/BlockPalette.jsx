import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComponent, updateStats } from '../../store/houseSlice';
import { BLOCK_TYPES } from '../../data/blockTypes';
import Button from '../shared/Button';

/**
 * Displays available blocks. Clicking a block adds it
 * to the *currently active page*.
 */
function BlockPalette() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.house.currentPage);

  const handleAddBlock = (type) => {
    // Dispatch an action to add the component to the current page
    dispatch(addComponent({ pageId: currentPage, type: type }));
    // Immediately update stats after adding
    dispatch(updateStats());
  };

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">Block Palette</h2>
      <div className="grid grid-cols-2 gap-3">
        {BLOCK_TYPES.map((block) => (
          <Button
            key={block.id}
            onClick={() => handleAddBlock(block.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-transform transform hover:scale-105 ${block.color} text-white font-medium shadow-md`}
            title={`Cost: ${block.cost}`}
          >
            {block.name}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default BlockPalette;
