import { configureStore } from '@reduxjs/toolkit';
import venueSlice from './features/venue/venueSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      venue: venueSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
