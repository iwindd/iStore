"use client";
import getPreOrdersDatatable from "@/actions/preorder/getPreOrdersDatatable";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PreOrderDetailDialog from "./PreOrderDetailDialog";

const PreOrdersDatatable = () => {
  const t = useTranslations("PREORDERS.datatable");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
        flex: 1,
        getActions: ({ row }: { row: any }) => [
          <GridActionsCellItem
            key="view"
            onClick={() => setSelectedId(row.id)}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
        ],
      },
    ];
  };

  const handleClose = () => {
    setSelectedId(null);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedId(null);
  };

  return (
    <>
      <Datatable
        key={refreshKey}
        name={"preorders"}
        columns={columns()}
        fetch={getPreOrdersDatatable}
        height={700}
      />
      {selectedId && (
        <PreOrderDetailDialog
          id={selectedId}
          open={!!selectedId}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

export default PreOrdersDatatable;
