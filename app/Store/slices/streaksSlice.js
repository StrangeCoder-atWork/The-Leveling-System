import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  streaks: {
    workout: 0,
    study: 0,
    work: 0,
    other: 0
  },
  history: {}
};

export const streaksSlice = createSlice({
  name: 'streaks',
  initialState,
  reducers: {
    updateStreak: (state, action) => {
      const { activity, value } = action.payload;
      if (state.streaks.hasOwnProperty(activity)) {
        state.streaks[activity] = value;
      }
    },
    incrementStreak: (state, action) => {
      const activity = action.payload;
      if (state.streaks.hasOwnProperty(activity)) {
        state.streaks[activity] += 1;
      }
    },
    addHistoryEntry: (state, action) => {
      const { activity, date, completed } = action.payload;
      const dateKey = date || new Date().toISOString().split('T')[0];
      
      if (!state.history[dateKey]) {
        state.history[dateKey] = {};
      }
      
      state.history[dateKey][activity] = completed;
    },
    setStreaks: (state, action) => {
      state.streaks = { ...state.streaks, ...action.payload };
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    }
  }
});

export const { 
  updateStreak, 
  incrementStreak, 
  addHistoryEntry, 
  setStreaks,
  setHistory
} = streaksSlice.actions;

export default streaksSlice.reducer;