"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export enum EnumDashboardRange {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
  ALL_TIME = "all-time",
  CUSTOM = "custom",
}

export type DashboardRange = {
  type: EnumDashboardRange;
  start: string;
  end: string;
};

export interface DashboardState {
  range: DashboardRange;
}

const initialState: DashboardState = {
  range: {
    type: EnumDashboardRange.MONTH,
    start: dayjs().subtract(1, "month").toISOString(),
    end: dayjs().toISOString(),
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setRange: (state, action: PayloadAction<DashboardRange>) => {
      state.range = action.payload;
    },
  },
});

export const { setRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
