import { type Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiTypography = {
  defaultProps: {
    variantMapping: {
      h1: "h2",
      h2: "h2",
      h3: "h2",
      h4: "h2",
      h5: "h2",
      h6: "h2",
      subtitle1: "h2",
      subtitle2: "h2",
      body1: "span",
      body2: "span",
      sidebarCollapsed: "p",
    },
  },
} satisfies Components<Theme>["MuiTypography"];
