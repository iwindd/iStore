"use client";
import fetchPromotionDatatable, {
  PromotionDatatableInstance,
} from "@/actions/promotion/fetchPromotionDatatable";
import DisablePromotionOffer from "@/actions/promotionOffer/disabled";
import GridLinkAction from "@/components/GridLinkAction";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import useDatatable from "@/hooks/useDatatable";
import App, { Wrapper } from "@/layouts/App";
import { date } from "@/libs/formatter";
import { getPath } from "@/router";
import {
  AddTwoTone,
  StopTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import CreatePromotionModal from "./components/CreatePromotionModal";

const MAPPING_PRODUCT_LABEL = (
  items:
    | PromotionDatatableInstance["getItems"]
    | PromotionDatatableInstance["buyItems"]
) => {
  return items
    .map((item) => `${item.product.label} (x${item.quantity})`)
    .join(", ");
};

const PromotionPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const disableConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะปิดใช้งานโปรโมชั่นหรือไม่",
    confirmProps: {
      color: "warning",
      startIcon: <StopTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        await DisablePromotionOffer(id);
        disableConfirmation.handleClose();
        await queryClient.refetchQueries({
          queryKey: ["promotions"],
          type: "active",
        });
        enqueueSnackbar("ปิดใช้งานโปรโมชั่นเรียบร้อยแล้ว!", {
          variant: "success",
        });
      } catch (error) {
        console.error("Error disabling promotion offer:", error);
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      }
    },
  });

  const menu = {
    disable: useCallback(
      (promotion: PromotionDatatableInstance) => () => {
        disableConfirmation.with(promotion.id);
        disableConfirmation.handleOpen();
      },
      [disableConfirmation]
    ),
  };

  const datatable = useDatatable<PromotionDatatableInstance>({
    name: "promotions",
    fetch: fetchPromotionDatatable,
    columns: [
      {
        flex: 1,
        field: "created_at",
        renderCell: ({ row }) =>
          `${date(row.event.start_at, {
            shortMonth: true,
            shortYear: true,
            withTime: false,
          })} - ${date(row.event.end_at, {
            shortMonth: true,
            shortYear: true,
            withTime: false,
          })}`,
        headerName: "ระยะเวลาโปรโมชั่น",
      },

      {
        field: "event.note",
        headerName: "หมายเหตุ",
        flex: 1,
        renderCell: ({ row }) => {
          return row.event.note || "-";
        },
      },
      {
        flex: 2,
        field: "buyItems._count",
        renderCell: ({ row }) => MAPPING_PRODUCT_LABEL(row.buyItems),
        headerName: "จำนวนสินค้าที่ซื้อ",
      },
      {
        flex: 2,
        field: "getItems._count",
        renderCell: ({ row }) => MAPPING_PRODUCT_LABEL(row.getItems),
        headerName: "จำนวนสินค้าที่ได้รับ",
      },
      {
        field: "event.creator.user.name",
        renderCell: ({ row }) => row.event.creator?.user.name || "ไม่ระบุ",
        headerName: "ผู้สร้างโปรโมชั่น",
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 0,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={`${getPath("promotions.buyXgetY", { id: row.id.toString() })}`}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
            showInMenu
          />,
          <GridActionsCellItem
            key="disable"
            icon={<StopTwoTone />}
            label="ปิดใช้งานโปรโมชั่น"
            onClick={menu.disable(row)}
            showInMenu
            disabled={
              row.event.disabled_at !== null ||
              dayjs(row.event.end_at).isBefore(dayjs())
            }
          />,
        ],
      },
    ],
  });

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>โปรโมชั่น</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
            onClick={() => setIsOpen(true)}
          >
            เพิ่มรายการ
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>{datatable}</App.Main>

      <CreatePromotionModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
      <Confirmation {...disableConfirmation.props} />
    </Wrapper>
  );
};

export default PromotionPage;
