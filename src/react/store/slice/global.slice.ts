import { createSlice } from '@reduxjs/toolkit';
import Picture from '../../../model/picture';
import { stat } from 'original-fs';

export interface GlobalState {
  pictures: Picture[] | null;
  logVisible: boolean | false;
  currentPicture: Picture | null;
}

const initialState: GlobalState = {
  logVisible: false,
  pictures: [],
  currentPicture: null
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLogVisible: (state, action) => {
      state.logVisible = action.payload;
    }, 
    logToggle: (state, action) => {
      state.logVisible = !state.logVisible;
    },
    addPicture: (state, action) => {
      state.pictures = [...state.pictures, action.payload];
    },
    cleanPictures: (state, action) => {
      state.pictures = [];
    },
    setCurrentPicture: (state, action) => {
      state.currentPicture = action.payload;
    }
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
