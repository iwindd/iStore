import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";

declare module "@mui/material/IconButton" {
  interface IconButtonOwnProps {
    noAnimate?: boolean;
  }
}

export const MuiIconButton = {
  styleOverrides: {
    root: {
      "& ": {
        transition: "transform 0.05s ease-in-out",
      },
      "&:hover ": {
        transform: "scale(1.05)",
      },
      "&:active ": {
        transform: "scale(0.9)",
      },
    },
  },
} satisfies Components<Theme>["MuiIconButton"];
