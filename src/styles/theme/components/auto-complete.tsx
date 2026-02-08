import { type Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiAutocomplete = {
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
      border: `1px solid ${theme.palette.divider}`,
      elevation: 3,
      boxShadow: "var(--custom-popover-shadow)",
      backgroundImage: "var(--custom-popover-bg) !important",
      backdropFilter: "blur(24px) saturate(120%)",
    }),
  },
} satisfies Components<Theme>["MuiAutocomplete"];
