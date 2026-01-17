import type { Components } from "@mui/material/styles";

import type { Theme } from "../types";

export const MuiGrid = {
  defaultProps: { spacing: 3 },
} satisfies Components<Theme>["MuiGrid"];
