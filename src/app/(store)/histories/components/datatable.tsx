"use client";
import getHistoryDatatable from "@/actions/order/getHistoryDatatable";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import * as ff from "@/libs/formatter";
import { getPath } from "@/router";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { Category } from "@prisma/client";
import { useTranslations } from "next-intl";

const HistoryDatatable = () => {
  const t = useTranslations("HISTORIES.datatable");
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
          ff.text(data?.value?.user?.name || t("placeholders.not_specified")),
      },
      {
        field: "total",
        sortable: true,
        headerName: t("headers.total"),
        flex: 1,
        editable: false,
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
        field: "products",
        sortable: false,
        headerName: t("headers.products"),
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          data.value
            .map(
              (item: {
                count: string;
                product: {
                  label: string;
                };
              }) => `${item.count}x${item.product.label}`
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
        flex: 1,
        getActions: ({ row }: { row: Category }) => [
          <GridLinkAction
            key="view"
            to={`${getPath("histories.history", { id: row.id.toString() })}`}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <Datatable
      name={"histories"}
      columns={columns()}
      fetch={getHistoryDatatable}
      height={700}
    />
  );
};

export default HistoryDatatable;
