import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiTab = {
  defaultProps: {},
  styleOverrides: {
    root: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.71,
      minWidth: "auto",
      paddingLeft: 0,
      paddingRight: 0,
      padding: "0 14px",
      textTransform: "none",
      "& + &": { marginLeft: "24px" },
    },
  },
} satisfies Components<Theme>["MuiTab"];
