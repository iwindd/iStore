"use client";
import getHistoryDatatable from "@/actions/order/getHistoryDatatable";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import * as ff from "@/libs/formatter";
import { getPath } from "@/router";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { Category } from "@prisma/client";

const HistoryDatatable = () => {
  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันทำรายการ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.date(data.value),
      },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้คิดเงิน",
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          ff.text(data?.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "total",
        sortable: true,
        headerName: "ยอดรวม",
        flex: 1,
        editable: false,
      },
      {
        field: "cost",
        sortable: true,
        headerName: "ต้นทุน",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "profit",
        sortable: true,
        headerName: "กำไร",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "products",
        sortable: false,
        headerName: "สินค้า",
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
            .join(", ") || "ไม่พบสินค้า",
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
        getActions: ({ row }: { row: Category }) => [
          <GridLinkAction
            key="view"
            to={`${getPath("histories.history", { id: row.id.toString() })}`}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
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
