"use client";
import GetHistories from "@/actions/order/get";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { Path } from "@/config/Path";
import * as ff from "@/libs/formatter";
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
        field: "price",
        sortable: true,
        headerName: "ราคา",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
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
        field: "text",
        sortable: false,
        headerName: "สินค้า",
        flex: 1,
        editable: false,
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
            to={`${Path("histories").href}/${row.id}`}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"histories"}
        columns={columns()}
        fetch={GetHistories}
        height={700}
      />
    </>
  );
};

export default HistoryDatatable;
