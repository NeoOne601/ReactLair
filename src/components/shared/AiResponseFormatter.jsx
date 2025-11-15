import React from 'react';

/**
 * A simple component to format text from the AI.
 * (Future-proofed for parsing markdown, etc.)
 */
function AiResponseFormatter({ text }) {
  // For now, just render with whitespace preservation
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
      {text}
    </pre>
  );
}

export default AiResponseFormatter;
