// store/mobileSearchSlice.js
import { createSlice } from '@reduxjs/toolkit';

const mobileSearchSlice = createSlice({
  name: 'mobileSearch',
  initialState: {
    isVisible: false, // Initial visibility state
  },
  reducers: {
    showMobileSearch: (state) => {
      state.isVisible = true;
    },
    hideMobileSearch: (state) => {
      state.isVisible = false;
    },
    toggleMobileSearch: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});

export const { showMobileSearch, hideMobileSearch, toggleMobileSearch } = mobileSearchSlice.actions;
export default mobileSearchSlice.reducer;