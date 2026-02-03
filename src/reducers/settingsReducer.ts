"use client";
import {
  DashboardStatKey,
  DEFAULT_DASHBOARD_STATS_VISIBILITY,
} from "@/config/Dashboard/StatConfig";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatsDisplayMode = "auto" | "custom";

export interface StatsSettings {
  displayMode: StatsDisplayMode;
  visibility: Record<DashboardStatKey, boolean>;
}

export interface StoreSettings {
  stats: StatsSettings;
  widgets: {
    stats: boolean;
    analysis: boolean;
  };
}

export interface SettingsState {
  stores: Record<string, StoreSettings>;
}

const defaultStatsSettings: StatsSettings = {
  displayMode: "auto",
  visibility: DEFAULT_DASHBOARD_STATS_VISIBILITY,
};

const defaultStoreSettings: StoreSettings = {
  stats: defaultStatsSettings,
  widgets: {
    stats: true,
    analysis: true,
  },
};

const initialState: SettingsState = {
  stores: {},
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setWidgetVisibility: (
      state,
      action: PayloadAction<{
        storeSlug: string;
        widget: keyof StoreSettings["widgets"];
        visible: boolean;
      }>,
    ) => {
      const { storeSlug, widget, visible } = action.payload;

      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }

      state.stores[storeSlug].widgets[widget] = visible;
    },
    setStatsDisplayMode: (
      state,
      action: PayloadAction<{
        storeSlug: string;
        mode: StatsDisplayMode;
      }>,
    ) => {
      const { storeSlug, mode } = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
      console.log(
        "SELECTED MODE",
        mode,
        state.stores[storeSlug].stats.displayMode,
      );

      console.log(state.stores[storeSlug].stats, "STORES");
      state.stores[storeSlug].stats.displayMode = mode;
    },
    setStatVisibility: (
      state,
      action: PayloadAction<{
        storeSlug: string;
        stat: keyof StatsSettings["visibility"];
        visible: boolean;
      }>,
    ) => {
      const { storeSlug, stat, visible } = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
      state.stores[storeSlug].stats.visibility[stat] = visible;
    },
    initStoreSettings: (state, action: PayloadAction<string>) => {
      const storeSlug = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
    },
  },
});

export const {
  setWidgetVisibility,
  setStatsDisplayMode,
  setStatVisibility,
  initStoreSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
