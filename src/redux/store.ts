import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './slice';

const store = configureStore({
  reducer: {
    moduleSlice: sliceReducer,
  },
});

export default store;