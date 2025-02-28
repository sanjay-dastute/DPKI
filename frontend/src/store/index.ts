import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import didReducer from './slices/didSlice';
import vcReducer from './slices/vcSlice';
import documentReducer from './slices/documentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    did: didReducer,
    vc: vcReducer,
    document: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
