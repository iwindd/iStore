"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NavbarVariant = "default" | "collapse";

export interface UIState {
  navbarVariant: NavbarVariant;
}

const initialState: UIState = {
  navbarVariant: "default",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setNavbarVariant: (state, action: PayloadAction<NavbarVariant>) => {
      state.navbarVariant = action.payload;
    },
    toggleNavbarVariant: (state) => {
      state.navbarVariant =
        state.navbarVariant === "default" ? "collapse" : "default";
    },
  },
});

export const { setNavbarVariant, toggleNavbarVariant } = uiSlice.actions;
export default uiSlice.reducer;
