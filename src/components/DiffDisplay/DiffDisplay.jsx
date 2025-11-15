import React from 'react';
import { useSelector } from 'react-redux';
import AiResponseFormatter from '../shared/AiResponseFormatter';

/**
 * A placeholder component to show an AI-generated diff.
 */
function DiffDisplay() {
  const { aiDiff, isLoadingAI } = useSelector((state) => state.house);

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">AI Code Diff</h2>
      <div className="w-full p-4 h-96 overflow-y-auto bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
        <AiResponseFormatter text={aiDiff} />
        {/* In a real app, this would be a proper diff viewer */}
      </div>
    </section>
  );
}

export default DiffDisplay;
