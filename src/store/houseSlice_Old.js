// This is the "Master Blueprint Room" from your plan.
// It replaces the simple 'gardenSlice' with a more
// robust slice that manages the whole application.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { BLOCK_TYPES } from '../data/blockTypes';

// --- Initial State ---
// This is the starting "blueprint" for our app's entire state.
const initialState = {
  currentPage: 'GARDEN', // 'GARDEN', 'HOUSE', 'GARAGE'
  
  // AI & Learning State
  aiBlueprint: 'Click "Generate Idea" to get a blueprint from AI.',
  aiLearningConcept: 'Click a concept to learn more.',
  aiDiff: 'No changes detected yet.',
  isLoadingAI: false,
  errorAI: null,

  // Building State
  // This structure is more complex, as planned
  pages: {
    GARDEN: {
      id: 'GARDEN',
      name: 'Garden',
      components: [], // e.g., { id: 'uuid-1', type: 'flower' }
    },
    HOUSE: {
      id: 'HOUSE',
      name: 'House',
      components: [], // e.g., { id: 'uuid-2', type: 'brick' }
    },
    GARAGE: {
      id: 'GARAGE',
      name: 'Legacy Garage',
      components: [], // e.g., { id: 'uuid-3', type: 'stone' }
    },
  },
  
  // Stats
  stats: {
    totalBlocks: 0,
    totalCost: 0,
  }
};

// --- Async Thunks (for API calls) ---
// This thunk calls OUR OWN backend, not Gemini directly.
export const fetchAIResponse = createAsyncThunk(
  'house/fetchAIResponse',
  async ({ userPrompt, systemPrompt }, { rejectWithValue }) => {
    try {
      // Call our own secure serverless function
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, systemPrompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch from backend');
      }
      
      const data = await response.json(); // { text: "..." }
      return data.text;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// --- The Slice ---
// createSlice from Redux Toolkit automatically creates
// reducers and actions from this definition.
const houseSlice = createSlice({
  name: 'house',
  initialState,
  
  // 'reducers' are for synchronous actions
  reducers: {
    // Navigation Action
    setCurrentPage(state, action) {
      state.currentPage = action.payload; // e.g., 'HOUSE'
    },

    // Building Actions (as described in the plan)
    addComponent(state, action) {
      const { pageId, type } = action.payload;
      const block = BLOCK_TYPES.find(b => b.id === type);
      if (block && state.pages[pageId]) {
        state.pages[pageId].components.push({
          id: uuidv4(),
          type: type,
        });
      }
    },
    
    removeComponent(state, action) {
      const { pageId, componentId } = action.payload;
      if (state.pages[pageId]) {
        state.pages[pageId].components = state.pages[pageId].components.filter(
          c => c.id !== componentId
        );
      }
    },
    
    clearPage(state, action) {
      const pageId = action.payload;
      if (state.pages[pageId]) {
        state.pages[pageId].components = [];
      }
    },
    
    // Stats Action
    updateStats(state) {
      let totalBlocks = 0;
      let totalCost = 0;
      
      // Loop over all pages and all components
      Object.values(state.pages).forEach(page => {
        page.components.forEach(component => {
          const block = BLOCK_TYPES.find(b => b.id === component.type);
          if (block) {
            totalBlocks += 1;
            totalCost += block.cost;
          }
        });
      });
      
      state.stats.totalBlocks = totalBlocks;
      state.stats.totalCost = totalCost;
    },
  },
  
  // 'extraReducers' are for async actions (our thunk)
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIResponse.pending, (state) => {
        state.isLoadingAI = true;
        state.errorAI = null;
      })
      .addCase(fetchAIResponse.fulfilled, (state, action) => {
        state.isLoadingAI = false;
        // We need to know where to put the response.
        // For this demo, we'll assume it's for the blueprint.
        // A more complex app would pass a 'target' (e.g., 'blueprint', 'diff')
        state.aiBlueprint = action.payload;
      })
      .addCase(fetchAIResponse.rejected, (state, action) => {
        state.isLoadingAI = false;
        state.errorAI = action.payload; // e.g., "Failed to fetch"
      });
  },
});

// Export the actions for components to use
export const { 
  setCurrentPage, 
  addComponent, 
  removeComponent,
  clearPage,
  updateStats 
} = houseSlice.actions;

// Export the reducer for the store
export default houseSlice.reducer;
