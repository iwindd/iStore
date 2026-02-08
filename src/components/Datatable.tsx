"use client";
import {
  alpha,
  Box,
  ButtonProps,
  CardContent,
  CardContentProps,
  Theme,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import thTHGrid from "./locale/datatable";

export interface TableOption {
  title: string;
  Icon: React.FC;
  props: ButtonProps;
  onClick: () => void;
}

export interface TableFetch {
  sort: GridSortModel;
  pagination: GridPaginationModel;
  filter: GridFilterModel;
  storeIdentifier: string;
}

export interface DatatableProps<
  T extends GridValidRowModel = any,
> extends DataGridProps {
  columns: GridColDef<T>[];
  name: string;
  height?: string | number;
  fetch: (payload: TableFetch, ...args: any) => any;
  bridge?: any[];
  variant?: "default" | "card";
}

const getDatatableVariantSxProps = (
  theme: Theme,
  variant: "default" | "card",
) => {
  switch (variant) {
    case "default":
      return {
        boxShadow: "var(--custom-shadow-1-light)",
      };
    case "card":
      return {
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: `var(--mui-palette-background-level1)`,
        },

        "& .MuiDataGrid-columnHeader": {
          backgroundColor: `var(--mui-palette-background-level1)`,
          color: `var(--mui-palette-text-secondary)`,
        },
        "& .MuiDataGrid-columnSeparator": {
          color: alpha(theme.palette.secondary.main, 0.1),
        },
      };
    default:
      return {};
  }
};

const TableCardContent = ({ children, ...props }: CardContentProps) => {
  const theme = useTheme();

  return (
    <CardContent
      sx={{
        p: 0,
        "& .MuiCardContent-root": {
          padding: "0 !important",
        },
      }}
      {...props}
    >
      {children}
    </CardContent>
  );
};

TableCardContent.displayName = "Datatable.CardContent";

const Datatable = ({
  columns,
  name,
  height,
  fetch,
  bridge,
  variant = "default",
  ...props
}: DatatableProps) => {
  const [rows, setRows] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });

  const theme = useTheme();

  const params = useParams<{ store: string }>();
  const { data, isLoading } = useQuery({
    queryKey: [
      name,
      paginationModel.page,
      paginationModel.pageSize,
      sortModel,
      filterModel.quickFilterValues?.join(","),
      bridge,
    ],
    queryFn: async () => {
      return await fetch(
        {
          sort: sortModel,
          pagination: paginationModel,
          filter: filterModel,
          storeIdentifier: params.store,
        },
        ...(bridge || []),
      );
    },
  });

  React.useEffect(() => {
    let isSuccess = data?.success || data?.state;

    if (
      !isSuccess &&
      data?.success === undefined &&
      data?.state === undefined
    ) {
      isSuccess = true;
    }

    if (isSuccess && data) {
      setRows(data.data);
      setTotal(data.total || 0);
    }
  }, [data, setRows, setTotal]);

  return (
    <Box
      sx={{
        height: height ?? 701,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading || props.loading}
        rowCount={total}
        localeText={thTHGrid}
        pageSizeOptions={[10, 25, 50, 100]}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            csvOptions: {
              utf8WithBom: true,
            },
            printOptions: {
              disableToolbarButton: true,
            },
          },
        }}
        showToolbar
        paginationMode="server"
        sortingMode="server"
        filterMode="client"
        filterModel={filterModel}
        filterDebounceMs={400}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
        sx={getDatatableVariantSxProps(theme, variant)}
        {...props}
      />
    </Box>
  );
};

Datatable.displayName = "Datatable";
Datatable.CardContent = TableCardContent;

export default Datatable;
