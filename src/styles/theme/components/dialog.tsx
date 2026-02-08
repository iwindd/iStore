import { type Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiDialog = {
  defaultProps: {
    slotProps: {
      paper: {
        elevation: 0,
      },
    },
  },
  styleOverrides: {
    root: {
      backgroundImage: "unset",
    },
    paper: ({ theme }) => ({
      boxShadow: "var(--custom-drawer-shadow)",
      backgroundImage: "var(--custom-drawer-bg) !important",
      backdropFilter: "blur(24px) saturate(120%)",
    }),
  },
} satisfies Components<Theme>["MuiDialog"];
