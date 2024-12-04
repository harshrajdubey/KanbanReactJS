import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    data: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.data = action.payload;
    },
    addTask: (state, action) => {
      state.data.push(action.payload);
    },
  },
});

export const { setTasks, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
