import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  flashcards: {}
};

export const flashcardsSlice = createSlice({
  name: 'flashcards',
  initialState,
  reducers: {
    addFlashcard: (state, action) => {
      state.flashcards[action.payload.id] = action.payload;
    },
    updateFlashcard: (state, action) => {
      state.flashcards[action.payload.id] = {
        ...state.flashcards[action.payload.id],
        ...action.payload
      };
    },
    deleteFlashcard: (state, action) => {
      delete state.flashcards[action.payload];
    },
    setFlashcards: (state, action) => {
      state.flashcards = action.payload;
    }
  }
});

export const { addFlashcard, updateFlashcard, deleteFlashcard, setFlashcards } = flashcardsSlice.actions;
export default flashcardsSlice.reducer;