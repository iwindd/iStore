"use client";
import React from "react";
import Datatable from "@/components/Datatable";
import { CheckTwoTone, ViewAgendaTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import GridLinkAction from "@/components/GridLinkAction";
import { Path } from "@/config/Path";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { date, number, text } from "@/libs/formatter";
import GetOverstocks from "@/actions/overstock/get";
import PatchOverstock from "@/actions/overstock/patch";

const OverstockDatatable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการเปลี่ยนสถานะรายการหรือไม่?",
    confirmProps: {
      color: "success",
      startIcon: <CheckTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        const resp = await PatchOverstock(id);

        if (!resp.success) throw Error("error");
        enqueueSnackbar("ปรับเปลี่ยนสถานะเรียบร้อยแล้ว!", {
          variant: "success",
        });
        await queryClient.refetchQueries({
          queryKey: ["overstocks"],
          type: "active",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      }
    },
  });

  const menu = {
    patch: React.useCallback(
      (orderId: number) => () => {
        confirmation.with(orderId);
        confirmation.handleOpen();
      },
      [confirmation]
    ),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันที่ทำรายการ",
        flex: 2,
        editable: false,
        renderCell: ({ row }) => date(row.order.created_at),
      },
      {
        field: "order",
        sortable: true,
        headerName: "ผู้คิดเงิน",
        flex: 2,
        renderCell: (data: any) => text(data?.value?.user_store?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "label",
        sortable: true,
        headerName: "สินค้า",
        flex: 2,
        editable: false,
      },
      {
        field: "note",
        sortable: true,
        headerName: "หมายเหตุ",
        flex: 2,
        editable: false,
        renderCell: ({ row }) => text(row.order.note),
      },
      {
        field: "overstock",
        sortable: true,
        headerName: "จำนวนที่ค้าง",
        flex: 2,
        editable: false,
        renderCell: ({ value }) => `${number(value)} รายการ`,
      },
      {
        field: "overstock_at",
        sortable: true,
        headerName: "สถานะ",
        flex: 2,
        editable: false,
        renderCell: ({ value }) => (value ? `${date(value)}` : "ค้าง"),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 2,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={`${Path("histories").href}/${row.order.id}`}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
            showInMenu
          />,
          <GridActionsCellItem
            key="success"
            icon={<CheckTwoTone />}
            onClick={menu.patch(row.id)}
            label="สำเร็จรายการ"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"overstocks"}
        columns={columns()}
        fetch={GetOverstocks}
        height={700}
        getCellClassName={(params) =>
          params.field == "overstock_at"
            ? `text-color-${params.value ? "success" : "error"}`
            : ""
        }
      />

      <Confirmation {...confirmation.props} />
    </>
  );
};

export default OverstockDatatable;
