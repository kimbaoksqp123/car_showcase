import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import vehicleReducer from '@/lib/redux/features/vehicleSlice';
import authReducer from '@/lib/redux/features/authSlice';
import fileReducer from '@/lib/redux/features/fileSlice';

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
    auth: authReducer,
    files: fileReducer,
    // Thêm các reducer khác ở đây khi cần
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 