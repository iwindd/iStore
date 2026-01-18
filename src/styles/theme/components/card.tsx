import { paperClasses } from "@mui/material/Paper";
import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiCard = {
  styleOverrides: {
    root: ({ theme }) => {
      return {
        [`&.${paperClasses.elevation1}`]: {
          boxShadow:
            theme.palette.mode === "dark"
              ? "var(--custom-shadow-1-dark)"
              : "var(--custom-shadow-1-light)",
        },
      };
    },
  },
} satisfies Components<Theme>["MuiCard"];
