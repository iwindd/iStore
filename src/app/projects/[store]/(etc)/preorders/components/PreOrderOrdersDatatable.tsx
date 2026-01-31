"use client";

import getPreOrderOrdersDatatable from "@/actions/preorder/getPreOrderOrdersDatatable";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

const PreOrderOrdersDatatable = () => {
  const t = useTranslations("PREORDERS.ordersDatatable");
  const router = useRouter();
  const params = useParams();

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
        field: "itemsCount",
        sortable: false, // Computed field, might not be sortable easily in server side without sorting by aggregations which is tricky in Prisma
        headerName: t("headers.itemsCount"),
        flex: 0.5,
      },
      {
        field: "total",
        sortable: true,
        headerName: t("headers.total"),
        flex: 1,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "creator",
        sortable: false,
        headerName: t("headers.creator"),
        flex: 1,
        renderCell: (data: any) => {
          const user = data.value?.user;
          return user ? `${user.first_name} ${user.last_name}` : "-";
        },
      },
      {
        field: "status",
        sortable: false,
        headerName: t("headers.status"),
        flex: 1,
        renderCell: (data: any) => {
          const status = data.value;
          let color:
            | "default"
            | "primary"
            | "secondary"
            | "error"
            | "info"
            | "success"
            | "warning" = "default";

          if (status === "PENDING") color = "primary";
          else if (status === "COMPLETED") color = "success";

          return <Chip label={status} color={color} size="small" />;
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 1,
        getActions: ({ row }: { row: any }) => [
          <GridActionsCellItem
            key="view"
            onClick={() =>
              router.push(`/projects/${params.store}/histories/${row.id}`)
            }
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
      name="preorder_orders"
      columns={columns()}
      fetch={getPreOrderOrdersDatatable}
      height={700}
    />
  );
};

export default PreOrderOrdersDatatable;
