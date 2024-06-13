import { configureStore, createSlice } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import publicReducer from '../processes/model/processes-reducer';
import periodReducer from 'features/Loader/Period/model/period-reducer';
import divisionReducer from 'features/Filters/model/filters-reducer';
import serviceReducer from 'features/Services/model/service-reducer';
import { confirmReducer } from 'features/ConfirmWindow';

export const rootReducer = combineReducers({
  publicReducer: publicReducer,
  periodReducer: periodReducer,
  divisionReducer: divisionReducer,
  serviceReducer: serviceReducer,
  confirmReducer: confirmReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
