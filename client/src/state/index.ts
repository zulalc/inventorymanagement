import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarOpen: boolean;
}

const initialState: InitialStateTypes = {
  isSidebarOpen: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setIsSidebarOpen } = globalSlice.actions;

export default globalSlice.reducer;
