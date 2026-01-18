import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiTextField = {
  defaultProps: {
    color: "secondary",
  },
  styleOverrides: {
    root: {
      borderRadius: "5px",
      "& .MuiOutlinedInput-root": {
        borderRadius: "5px",
      },
    },
  },
} satisfies Components<Theme>["MuiTextField"];
