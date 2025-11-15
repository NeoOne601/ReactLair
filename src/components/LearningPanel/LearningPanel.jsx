import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONCEPTS } from '../../data/concepts';
import { fetchAIResponse } from '../../store/houseSlice';
import Button from '../shared/Button';

/**
 * Renders a list of learning concepts.
 * Clicking one will fetch an explanation from the AI.
 * (Note: This is a demo and will overwrite the main blueprint text for now.)
 */
function LearningPanel() {
  const dispatch = useDispatch();
  const { isLoadingAI } = useSelector((state) => state.house);

  const handleConceptClick = (concept) => {
    const systemPrompt = "You are a friendly and helpful React.js expert. You explain complex topics simply, using analogies.";
    // This will call our API and the thunk will place the
    // response in `aiBlueprint`.
    dispatch(fetchAIResponse({ userPrompt: concept.prompt, systemPrompt }));
  };

  return (
    <section className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">React Concepts</h2>
      <div className="flex flex-col gap-2">
        {CONCEPTS.map((concept) => (
          <Button
            key={concept.id}
            variant="secondary"
            onClick={() => handleConceptClick(concept)}
            disabled={isLoadingAI}
            className="text-left"
          >
            {concept.name}
          </Button>
        ))}
      </div>
    </section>
  );
}

export default LearningPanel;
