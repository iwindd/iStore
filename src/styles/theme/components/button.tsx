import { alpha, type Components } from "@mui/material/styles";

import type { Theme } from "../types";
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

export const MuiButton = {
  styleOverrides: {
    root: {
      borderRadius: "5px",
      textTransform: "none",
      variants: [
        {
          props: { variant: "dashed", color: "secondary" },
          style: ({ theme }) => ({
            color: alpha(theme.palette.secondary.main, 0.7),
            border: `2px dashed ${alpha(theme.palette.secondary.main, 0.4)}`,

            "&:hover": {
              color: alpha(theme.palette.secondary.main, 0.9),
              border: `2px dashed ${alpha(theme.palette.secondary.main, 0.6)}`,
              backgroundColor: alpha(theme.palette.secondary.main, 0.04),
            },
          }),
        },
      ],
    },
    sizeSmall: { padding: "6px 16px" },
    sizeMedium: { padding: "8px 20px" },
    sizeLarge: { padding: "11px 24px" },
    textSizeSmall: { padding: "7px 12px" },
    textSizeMedium: { padding: "9px 16px" },
    textSizeLarge: { padding: "12px 16px" },
  },
} satisfies Components<Theme>["MuiButton"];
