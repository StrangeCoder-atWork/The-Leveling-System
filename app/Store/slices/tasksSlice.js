import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: {}
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks[action.payload.id] = action.payload;
    },
    updateTask: (state, action) => {
      state.tasks[action.payload.id] = {
        ...state.tasks[action.payload.id],
        ...action.payload
      };
    },
    deleteTask: (state, action) => {
      delete state.tasks[action.payload];
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    }
  }
});

export const { addTask, updateTask, deleteTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;