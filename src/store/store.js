// This file configures the main Redux store
// exactly as specified in the project plan.
import { configureStore } from '@reduxjs/toolkit';
import houseReducer from './houseSlice';

export const store = configureStore({
  reducer: {
    // The 'house' key here is what makes `state.house` work
    house: houseReducer,
  },
});
