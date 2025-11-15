import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAIResponse } from '../../store/houseSlice';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import AiResponseFormatter from '../shared/AiResponseFormatter';

/**
 * Shows the AI-generated blueprint.
 * Handles loading and error states for the API call.
 */
function BlueprintDisplay() {
  const dispatch = useDispatch();
  
  // Select data from the *new* houseSlice
  const { aiBlueprint, isLoadingAI, errorAI } = useSelector((state) => state.house);

  const handleGenerate = () => {
    const systemPrompt = "You are an imaginative architect. Be creative and concise.";
    const userPrompt = "Generate a simple, creative blueprint for a small, whimsical structure (like a treehouse, garden shed, or hobbit hole). Describe it in one fun paragraph.";
    
    // This thunk will call our secure /api/explain endpoint
    dispatch(fetchAIResponse({ userPrompt, systemPrompt }));
  };

  const blueprintClasses = `
    w-full p-4 h-48 overflow-y-auto bg-white dark:bg-gray-700 border-2 
    border-gray-300 dark:border-gray-600 rounded-lg
    text-gray-700 dark:text-gray-300
    transition-all duration-300
    ${isLoadingAI ? 'animate-flash-blueprint' : ''} 
  `;

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">AI Blueprint</h2>
      <div className={blueprintClasses}>
        {isLoadingAI && (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        )}
        {!isLoadingAI && <AiResponseFormatter text={aiBlueprint} />}
      </div>
      
      {errorAI && (
        <p className="text-red-500 mt-2">Error: {errorAI}</p>
      )}

      <Button 
        onClick={handleGenerate} 
        disabled={isLoadingAI}
        className="mt-4 w-full"
      >
        {isLoadingAI ? 'Generating...' : 'Generate Idea'}
      </Button>
    </section>
  );
}

export default BlueprintDisplay;
