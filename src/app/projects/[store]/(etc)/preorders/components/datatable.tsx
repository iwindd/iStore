"use client";
import getPreOrdersDatatable from "@/actions/preorder/getPreOrdersDatatable";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { useRoute } from "@/hooks/use-route";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";

const PreOrdersDatatable = () => {
  const t = useTranslations("PREORDERS.datatable");
  const route = useRoute();

  const columns = (): GridColDef[] => {
    return [
      {
        field: "order",
        sortable: true,
        headerName: t("headers.date"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.date(data.value?.created_at),
      },
      {
        field: "product",
        sortable: false,
        headerName: t("headers.product"),
        flex: 2,
        editable: false,
        renderCell: (data: any) => {
          const product = data.value;
          return product?.serial
            ? `${product.label} (${product.serial})`
            : product?.label || "-";
        },
      },
      {
        field: "count",
        sortable: true,
        headerName: t("headers.count"),
        flex: 0.5,
        editable: false,
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
        field: "status",
        sortable: true,
        headerName: t("headers.status"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => <PreOrderStatusChip status={data.value} />,
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
        getActions: ({ row }: { row: any }) => [
          <GridLinkAction
            key="view"
            to={route.path("projects.store.preorders.preorder", {
              id: row.order.id.toString(),
            })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
          />,
        ],
      },
    ];
  };

  return (
    <Datatable
      name={"preorders"}
      columns={columns()}
      fetch={getPreOrdersDatatable}
    />
  );
};

export default PreOrdersDatatable;
