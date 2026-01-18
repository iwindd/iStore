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
      boxShadow:
        "0 0 2px 0 rgba(145 158 171 / 24%),-20px 20px 40px -4px rgba(145 158 171 / 24%)",
      backgroundImage: "var(--custom-popover-bg) !important",
    }),
  },
} satisfies Components<Theme>["MuiAutocomplete"];
