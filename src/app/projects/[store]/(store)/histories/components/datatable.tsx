"use client";
import getHistoryDatatable from "@/actions/order/getHistoryDatatable";
import PaymentMethodChip from "@/components/Chips/PaymentMethodChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import * as ff from "@/libs/formatter";
import { getPath } from "@/router";
import { InventoryTwoTone, ViewAgendaTwoTone } from "@mui/icons-material";
import { Chip, Stack, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { Category } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";
import { HistoryFilter } from "../types";
import HistoryFilterComponent from "./filter";

const HistoryDatatable = () => {
  const t = useTranslations("HISTORIES.datatable");
  const [filter, setFilter] = React.useState<HistoryFilter>({});

  const handleFilterChange = (newFilter: HistoryFilter) => {
    setFilter(newFilter);
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: t("headers.date"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.date(data.value),
      },
      {
        field: "creator",
        sortable: true,
        headerName: t("headers.creator"),
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          `${data?.value?.user?.first_name} ${data?.value?.user?.last_name}`,
      },
      {
        field: "method",
        sortable: true,
        headerName: t("headers.method"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) => <PaymentMethodChip method={data.value} />,
      },
      {
        field: "total",
        sortable: true,
        headerName: t("headers.total"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "profit",
        sortable: true,
        headerName: t("headers.profit"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "consignment",
        sortable: false,
        headerName: t("headers.consignment"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) =>
          data.row.consignment_id ? (
            <Tooltip
              title={t("consignment_tooltip", { id: data.row.consignment_id })}
            >
              <Chip
                label={`#${data.row.consignment_id}`}
                size="small"
                color="secondary"
                icon={<InventoryTwoTone />}
                variant="outlined"
              />
            </Tooltip>
          ) : (
            "-"
          ),
      },
      {
        field: "products",
        sortable: false,
        headerName: t("headers.products"),
        flex: 1.5,
        editable: false,
        renderCell: (data: any) =>
          data.value
            .map(
              (item: {
                count: string;
                product: {
                  label: string;
                };
              }) => `${item.count}x${item.product.label}`,
            )
            .join(", ") || t("placeholders.no_products"),
      },
      {
        field: "note",
        sortable: true,
        headerName: t("headers.note"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 0.8,
        getActions: ({ row }: { row: Category }) => [
          <GridLinkAction
            key="view"
            to={`${getPath("projects.store.histories.history", { id: row.id.toString() })}`}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <Stack spacing={1}>
      <HistoryFilterComponent onFilterChange={handleFilterChange} />
      <Datatable
        name={"histories"}
        columns={columns()}
        fetch={getHistoryDatatable}
        bridge={[filter]}
        height={600}
      />
    </Stack>
  );
};

export default HistoryDatatable;
