"use client";

import getPreOrderOrdersDatatable from "@/actions/preorder/getPreOrderOrdersDatatable";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { useRoute } from "@/hooks/use-route";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";

const PreOrderOrdersDatatable = () => {
  const t = useTranslations("PREORDERS.ordersDatatable");
  const route = useRoute();

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
          return <PreOrderStatusChip status={data.value} size="small" />;
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        getActions: ({ row }: { row: any }) => [
          <GridLinkAction
            key="view"
            to={route.path("projects.store.preorders.preorder", {
              id: row.id.toString(),
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
      name="preorder_orders"
      columns={columns()}
      fetch={getPreOrderOrdersDatatable}
      height={700}
    />
  );
};

export default PreOrderOrdersDatatable;
