"use client";
import React from "react";
import * as ff from "@/libs/formatter";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { Category } from "@prisma/client";
import GridLinkAction from "@/components/GridLinkAction";
import { GridColDef } from "@mui/x-data-grid";
import { Path } from "@/config/Path";
import Datatable from "@/components/Datatable";
import GetPurchase, { Purchase } from "@/actions/purchase/get";

const PurchaseDatatable = () => {
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
        field: "user_store",
        sortable: true,
        headerName: "ผู้ทำรายการ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.text(data?.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "cost",
        sortable: true,
        headerName: "ราคา",
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
        renderCell: ({row}: {row:Purchase}) => `${row.text} x${row.products[0].count}`,
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
            to={`${Path("purchase").href}/${row.id}`}
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
        name={"purchase"}
        columns={columns()}
        fetch={GetPurchase}
        height={700}
      />
    </>
  );
};

export default PurchaseDatatable;
