import type { Components } from "@mui/material/styles";
import type { Theme } from "../types";
import { MuiAutocomplete } from "./auto-complete";
import { MuiAvatar } from "./avatar";
import { MuiButton } from "./button";
import { MuiCard } from "./card";
import { MuiCardContent } from "./card-content";
import { MuiCardHeader } from "./card-header";
import { MuiGrid } from "./grid";
import { MuiLink } from "./link";
import { MuiPopover } from "./pop-over";
import { MuiStack } from "./stack";
import { MuiSwitch } from "./switch";
import { MuiTab } from "./tab";
import { MuiTableBody } from "./table-body";
import { MuiTableCell } from "./table-cell";
import { MuiTableFooter } from "./table-footer";
import { MuiTableHead } from "./table-head";
import { MuiTabs } from "./tabs";
import { MuiTextField } from "./textfield";

export const components = {
  MuiAvatar,
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardHeader,
  MuiLink,
  MuiPopover,
  MuiAutocomplete,
  MuiStack,
  MuiGrid,
  MuiTab,
  MuiTableBody,
  MuiTableCell,
  MuiTableHead,
  MuiTableFooter,
  MuiTextField,
  MuiTabs,
  MuiSwitch,
  // @ts-ignore
  MuiDataGrid: {
    styleOverrides: {
      root: {
        borderRadius: "5px",
        border: 0,
      },
      cell: {
        display: "flex",
        alignItems: "center",
        fontSize: "0.875rem",
        "&:focus, &:focus-within": {
          outline: "none",
        },
      },
    },
  },
} satisfies Components<Theme>;
