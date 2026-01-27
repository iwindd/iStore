import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
}

export interface PermissionData {
  id: number;
  name: string;
}

export interface ProjectState {
  currentProject: ProjectData | null;
  permissions: PermissionData[];
}

const initialState: ProjectState = {
  currentProject: null,
  permissions: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<ProjectData>) => {
      state.currentProject = action.payload;
    },
    setPermissions: (state, action: PayloadAction<PermissionData[]>) => {
      state.permissions = action.payload;
    },
    clearProject: (state) => {
      state.currentProject = null;
      state.permissions = [];
    },
  },
});

export const { setProject, setPermissions, clearProject } =
  projectSlice.actions;

export default projectSlice.reducer;
