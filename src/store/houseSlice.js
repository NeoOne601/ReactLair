import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";

// This is the new "Thunk" for calling our serverless API
// It's an async function that will dispatch actions for us
export const generateExplanation = createAsyncThunk(
  "house/generateExplanation",
  async ({ userPrompt, systemPrompt }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt, systemPrompt }),
      });

      if (!response.ok) {
        // If the server returns a 500 or other error
        const errorData = await response.json();
        return rejectWithValue(
          errorData.error || "Failed to generate explanation"
        );
      }

      const data = await response.json();
      return data.text; // This will be the "payload" of the "fulfilled" action
    } catch (error) {
      // If the fetch itself fails
      return rejectWithValue(error.message);
    }
  }
);

// This is our new, much simpler "Master Blueprint" (Redux state)
const initialState = {
  // 1. The "House" page state
  blocks: [], // This will be our list of "LEGO" blocks, e.g., { id: '123', type: 'WALL', props: { color: 'blue' } }

  // 2. The "AI Tutor" state
  explanation: "",
  isLoading: false,
  error: null,
};

const houseSlice = createSlice({
  name: "house",
  initialState,
  // These are the "Reducers" - functions that update our state
  reducers: {
    // Action to add a new "LEGO" block
    addBlock: (state, action) => {
      const { type } = action.payload;
      let newBlock = {
        id: nanoid(), // Generate a unique ID
        type: type,
        props: {},
      };

      // Set default props based on type
      if (type === "WALL") {
        newBlock.props = { label: "Wall", color: "bg-gray-300" };
      } else if (type === "WINDOW") {
        newBlock.props = { label: "Window", color: "bg-blue-300" };
      }

      state.blocks.push(newBlock);
    },

    // Action to update the props of an existing block
    updateBlockProps: (state, action) => {
      const { id, newProps } = action.payload;
      const block = state.blocks.find((b) => b.id === id);
      if (block) {
        // Merge new props with existing props
        block.props = { ...block.props, ...newProps };
      }
    },

    // Action to remove a block
    removeBlock: (state, action) => {
      const { id } = action.payload;
      state.blocks = state.blocks.filter((b) => b.id !== id);
    },

    // Action to close the AI modal
    clearExplanation: (state) => {
      state.explanation = "";
      state.error = null;
    },
  },
  // This handles the state for our async "generateExplanation" thunk
  extraReducers: (builder) => {
    builder
      .addCase(generateExplanation.pending, (state) => {
        state.isLoading = true;
        state.explanation = ""; // Clear previous explanation
        state.error = null;
      })
      .addCase(generateExplanation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.explanation = action.payload; // Set the new explanation from Gemini
      })
      .addCase(generateExplanation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set the error message
      });
  },
});

// "Export" our actions so the components can use them
export const { addBlock, updateBlockProps, removeBlock, clearExplanation } =
  houseSlice.actions;

// "Export" the reducer so the store can use it
export default houseSlice.reducer;
