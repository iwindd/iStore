"use client";
import { Download } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

const CustomToolbar = ({ onExport }: { onExport?: () => any }) => {
  return (
    <GridToolbarContainer>
      <Stack
        direction={"row"}
        spacing={1}
        mb={1}
        justifyContent={"space-between"}
        sx={{ width: "100%" }}
      >
        <Stack direction={"row"} spacing={1}>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          {onExport && (
            <Button onClick={onExport} startIcon={<Download />}>
              Export
            </Button>
          )}
        </Stack>
        <Stack>
          <GridToolbarQuickFilter />
        </Stack>
      </Stack>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
