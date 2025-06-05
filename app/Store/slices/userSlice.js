"use client";
import { createSlice } from '@reduxjs/toolkit';

const calculateLevelAndRank = (xp) => {
  const level = Math.floor(xp / 700) + 1;
  let rank = 'E';
  
  if (level >= 10) {
    const rankLevel = Math.floor((level - 10) / 20);
    const ranks = ['D', 'C', 'B', 'A', 'S', 'SS'];
    rank = rankLevel >= ranks.length ? ranks[ranks.length - 1] : ranks[rankLevel];
  }
  
  return { level, rank };
};

const initialState = {
  xp: 0,
  money: 0,
  level: 1,
  rank: 'E',
  profession: 'Student',
  personalData: {
    name: 'User', // Default name
    info: ''
  },
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserStats: (state, action) => {
      const newState = { ...state, ...action.payload };
      if (action.payload.xp !== undefined) {
        const { level, rank } = calculateLevelAndRank(action.payload.xp);
        newState.level = level;
        newState.rank = rank;
      }
      return newState;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    updatePersonalData: (state, action) => {
      state.personalData = {
        ...state.personalData,
        ...action.payload
      };
    }
  }
});

export const { updateUserStats, setOnlineStatus, updatePersonalData } = userSlice.actions;
export default userSlice.reducer;