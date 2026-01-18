import { type Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiTabs = {
  defaultProps: {
    textColor: "secondary",
    indicatorColor: "secondary",
  },
} satisfies Components<Theme>["MuiTabs"];
