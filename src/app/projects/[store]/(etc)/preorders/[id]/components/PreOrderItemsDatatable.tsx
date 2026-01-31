"use client";

import getOrderPreOrderProducts from "@/actions/order/getOrderPreOrderProducts";
import updatePreOrderStatusBulk from "@/actions/preorder/updatePreOrderStatusBulk";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { Check, CloseTwoTone } from "@mui/icons-material";
import { Button, Card, CardHeader, Stack } from "@mui/material";
import { GridColDef, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { PreOrderStatus } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { usePreOrderOrder } from "../PreOrderOrderContext";

const PreOrderItemsCard = () => {
  const t = useTranslations("PREORDERS.detail.datatable");
  const tc = useTranslations("PREORDERS.detail");
  const f = useFormatter();
  const tDialog = useTranslations("PREORDERS.dialog");
  const { order } = usePreOrderOrder();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>([]),
    });
  const { enqueueSnackbar } = useSnackbar();
  const { store } = useParams<{ store: string }>();
  const queryClient = useQueryClient();

  const updatePreOrderStatusBulkMutation = useMutation({
    mutationFn: ({ status }: { status: PreOrderStatus }) =>
      updatePreOrderStatusBulk(
        store,
        Array.from(rowSelectionModel.ids).map(Number),
        status,
      ),
    onMutate: () => {
      if (rowSelectionModel.ids.size === 0) {
        return;
      }
    },
    onSuccess: (status) => {
      setRowSelectionModel({
        type: "include",
        ids: new Set<GridRowId>([]),
      });
      switch (status) {
        case PreOrderStatus.RETURNED:
          enqueueSnackbar(tDialog("messages.returned_success"), {
            variant: "success",
          });
          break;
        case PreOrderStatus.CANCELLED:
          enqueueSnackbar(tDialog("messages.cancelled_success"), {
            variant: "success",
          });
          break;
      }
      queryClient.invalidateQueries({
        queryKey: ["preorder_items"],
      });
    },
    onError: (error: any) => {
      console.error(error);
      enqueueSnackbar(error.message || tDialog("messages.error"), {
        variant: "error",
      });
    },
  });

  const confirmCancelSelected = useConfirm({
    title: tDialog("messages.cancel_confirm_title"),
    text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกพรีออเดอร์ที่เลือก?",
    onConfirm: async () =>
      updatePreOrderStatusBulkMutation.mutate({
        status: PreOrderStatus.CANCELLED,
      }),
  });

  const confirmCompleteSelected = useConfirm({
    title: "ยืนยันการทำรายการสำเร็จ",
    text: "คุณแน่ใจหรือไม่ว่าต้องการทำรายการพรีออเดอร์ที่เลือกให้สำเร็จ?",
    onConfirm: async () =>
      updatePreOrderStatusBulkMutation.mutate({
        status: PreOrderStatus.RETURNED,
      }),
  });

  const columns = (): GridColDef[] => {
    return [
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
        renderCell: (data: any) => f.number(data.value, "currency"),
      },
      {
        field: "status",
        sortable: true,
        headerName: t("headers.status"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => (
          <PreOrderStatusChip status={data.value as PreOrderStatus} />
        ),
      },
      {
        field: "note",
        sortable: true,
        headerName: t("headers.note"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.value,
      },
    ];
  };

  const isPending = (row: any) => row.status === PreOrderStatus.PENDING;

  return (
    <>
      <Card>
        <CardHeader
          title={tc("preorder_items")}
          action={
            <Stack direction="row" alignItems="center" spacing={1}>
              <PreOrderStatusChip status={order.status} />
              {rowSelectionModel.ids.size > 0 && (
                <>
                  <Button
                    startIcon={<CloseTwoTone />}
                    color="error"
                    size="small"
                    onClick={() => confirmCancelSelected.handleOpen()}
                  >
                    {t("bulkActions.cancel", {
                      count: f.number(rowSelectionModel.ids.size),
                    })}
                  </Button>
                  <Button
                    startIcon={<Check />}
                    color="success"
                    size="small"
                    onClick={() => confirmCompleteSelected.handleOpen()}
                  >
                    {t("bulkActions.return", {
                      count: f.number(rowSelectionModel.ids.size),
                    })}
                  </Button>
                </>
              )}
            </Stack>
          }
        />
        <Datatable.CardContent>
          <Datatable
            name="preorder_items"
            variant="card"
            columns={columns()}
            fetch={(table) => getOrderPreOrderProducts(table, order.id)}
            height={600}
            checkboxSelection
            isRowSelectable={(params) => isPending(params.row)}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </Datatable.CardContent>
      </Card>

      <Confirmation {...confirmCancelSelected.props} />
      <Confirmation {...confirmCompleteSelected.props} />
    </>
  );
};

export default PreOrderItemsCard;
