"use client";
import fetchPromotionDatatable, {
  PromotionDatatableInstance,
} from "@/actions/promotion/fetchPromotionDatatable";
import DisablePromotionOffer from "@/actions/promotionOffer/disabled";
import PromotionStatusChip from "@/components/Chips/PromotionStatusChip";
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
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import CreatePromotionModal from "./components/CreatePromotionModal";

const MAPPING_PRODUCT_LABEL = (
  items:
    | PromotionDatatableInstance["getItems"]
    | PromotionDatatableInstance["buyItems"],
) => {
  return items
    .map((item) => `${item.product.label} (x${item.quantity})`)
    .join(", ");
};

const PromotionPage = () => {
  const t = useTranslations("PROMOTIONS");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const disableConfirmation = useConfirm({
    title: t("datatable.disable_confirmation.title"),
    text: t("datatable.disable_confirmation.text"),
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
        enqueueSnackbar(t("datatable.disable_confirmation.success"), {
          variant: "success",
        });
      } catch (error) {
        console.error("Error disabling promotion offer:", error);
        enqueueSnackbar(t("datatable.disable_confirmation.error"), {
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
      [disableConfirmation],
    ),
  };

  const datatable = useDatatable<PromotionDatatableInstance>({
    name: "promotions",
    fetch: fetchPromotionDatatable,
    columns: [
      {
        field: "event.name",
        headerName: t("datatable.headers.name"),
        flex: 1,
        renderCell: ({ row }) => row.event.name || "-",
      },
      {
        field: "status",
        headerName: t("datatable.headers.status"),
        flex: 0.8,
        renderCell: ({ row }) => <PromotionStatusChip event={row.event} />,
      },
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
        headerName: t("datatable.headers.duration"),
      },

      {
        field: "event.note",
        headerName: t("datatable.headers.note"),
        flex: 1,
        renderCell: ({ row }) => {
          return row.event.note || "-";
        },
      },
      {
        flex: 2,
        field: "buyItems._count",
        renderCell: ({ row }) => MAPPING_PRODUCT_LABEL(row.buyItems),
        headerName: t("datatable.headers.buy_count"),
      },
      {
        flex: 2,
        field: "getItems._count",
        renderCell: ({ row }) => MAPPING_PRODUCT_LABEL(row.getItems),
        headerName: t("datatable.headers.get_count"),
      },
      {
        field: "event.creator.user.name",
        renderCell: ({ row }) =>
          row.event.creator?.user.name ||
          t("datatable.placeholders.not_specified"),
        headerName: t("datatable.headers.creator"),
        flex: 1,
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("datatable.headers.actions"),
        flex: 0,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={`${getPath("store.promotions.buyXgetY", { id: row.id.toString() })}`}
            icon={<ViewAgendaTwoTone />}
            label={t("datatable.actions.view")}
            showInMenu
          />,
          <GridActionsCellItem
            key="disable"
            icon={<StopTwoTone />}
            label={t("datatable.actions.disable")}
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
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
            onClick={() => setIsOpen(true)}
            color="secondary"
          >
            {t("add_button")}
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
