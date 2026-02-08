"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NavbarVariant = "default" | "collapse";
export type ThemeMode = "light" | "dark";

export interface UIState {
  navbarVariant: NavbarVariant;
  themeMode: ThemeMode;
  fontSize: number; // 1-10, default 5
}

const initialState: UIState = {
  navbarVariant: "default",
  themeMode: "light",
  fontSize: 5,
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
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(1, Math.min(10, action.payload));
    },
  },
});

export const {
  setNavbarVariant,
  toggleNavbarVariant,
  setThemeMode,
  toggleThemeMode,
  setFontSize,
} = uiSlice.actions;
export default uiSlice.reducer;
