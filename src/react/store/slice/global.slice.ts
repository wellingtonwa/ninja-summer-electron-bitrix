import { createSlice } from '@reduxjs/toolkit';

export interface GlobalState {
  logVisible: boolean | false;
  formStore: any;
}

const initialState: GlobalState = {
  logVisible: false,
  formStore: {},
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
    setFormStore: (state, action) => {
      state.formStore = action.payload;
    },
  },
});

export const globalActions = globalSlice.actions;

export default globalSlice.reducer;
