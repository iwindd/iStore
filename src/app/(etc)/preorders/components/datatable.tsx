"use client";
import getPreOrdersDatatable from "@/actions/preorder/getPreOrdersDatatable";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import PreOrderDetailDialog from "./PreOrderDetailDialog";

const PreOrdersDatatable = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = (): GridColDef[] => {
    return [
      {
        field: "order",
        sortable: true,
        headerName: "วันทำรายการ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.date(data.value?.created_at),
      },
      {
        field: "product",
        sortable: false,
        headerName: "สินค้า",
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
        headerName: "จำนวน",
        flex: 0.5,
        editable: false,
      },
      {
        field: "total",
        sortable: true,
        headerName: "ยอดรวม",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "status",
        sortable: true,
        headerName: "สถานะ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => <PreOrderStatusChip status={data.value} />,
      },
      {
        field: "note",
        sortable: true,
        headerName: "หมายเหตุ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: any }) => [
          <GridActionsCellItem
            key="view"
            onClick={() => setSelectedId(row.id)}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
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
