"use client";
import {
  DashboardAnalysisKey,
  DEFAULT_DASHBOARD_ANALYSIS_VISIBILITY,
} from "@/config/Dashboard/AnalysisConfig";
import {
  DashboardStatKey,
  DEFAULT_DASHBOARD_STATS_VISIBILITY,
} from "@/config/Dashboard/StatConfig";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DisplayMode = "auto" | "custom";

export interface StatsSettings {
  displayMode: DisplayMode;
  visibility: Record<DashboardStatKey, boolean>;
}

export interface AnalysisSettings {
  displayMode: DisplayMode;
  visibility: Record<DashboardAnalysisKey, boolean>;
}

export interface StoreSettings {
  stats: StatsSettings;
  analysis: AnalysisSettings;
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

const defaultAnalysisSettings: AnalysisSettings = {
  displayMode: "auto",
  visibility: DEFAULT_DASHBOARD_ANALYSIS_VISIBILITY,
};

const defaultStoreSettings: StoreSettings = {
  stats: defaultStatsSettings,
  analysis: defaultAnalysisSettings,
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
        mode: DisplayMode;
      }>,
    ) => {
      const { storeSlug, mode } = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
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
    setAnalysisDisplayMode: (
      state,
      action: PayloadAction<{
        storeSlug: string;
        mode: DisplayMode;
      }>,
    ) => {
      const { storeSlug, mode } = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
      state.stores[storeSlug].analysis.displayMode = mode;
    },
    setAnalysisVisibility: (
      state,
      action: PayloadAction<{
        storeSlug: string;
        analysis: keyof AnalysisSettings["visibility"];
        visible: boolean;
      }>,
    ) => {
      const { storeSlug, analysis, visible } = action.payload;
      if (!state.stores[storeSlug]) {
        state.stores[storeSlug] = { ...defaultStoreSettings };
      }
      state.stores[storeSlug].analysis.visibility[analysis] = visible;
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
  setAnalysisDisplayMode,
  setAnalysisVisibility,
  initStoreSettings,
} = settingsSlice.actions;
export default settingsSlice.reducer;
