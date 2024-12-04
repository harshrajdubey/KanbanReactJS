import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses localStorage by default
import tasksReducer from './tasksSlice';
import usersReducer from './usersSlice';
import filtersReducer from './filtersSlice';

const tasksPersistConfig = {
  key: 'tasks',
  storage,
};

const usersPersistConfig = {
  key: 'users',
  storage,
};

const filtersPersistConfig = {
  key: 'filters',
  storage,
};

const persistedTasksReducer = persistReducer(tasksPersistConfig, tasksReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);
const persistedFiltersReducer = persistReducer(filtersPersistConfig, filtersReducer);

const store = configureStore({
  reducer: {
    tasks: persistedTasksReducer,
    users: persistedUsersReducer,
    filters: persistedFiltersReducer,
  },
});

export const persistor = persistStore(store);
export default store;
