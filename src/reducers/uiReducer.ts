"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NavbarVariant = "default" | "collapse";
export type ThemeMode = "light" | "dark";

export interface UIState {
  navbarVariant: NavbarVariant;
  themeMode: ThemeMode;
}

const initialState: UIState = {
  navbarVariant: "default",
  themeMode: "light",
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
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
  },
});

export const {
  setNavbarVariant,
  toggleNavbarVariant,
  setThemeMode,
  toggleThemeMode,
} = uiSlice.actions;
export default uiSlice.reducer;
