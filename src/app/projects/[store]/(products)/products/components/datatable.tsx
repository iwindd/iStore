"use client";
import deleteProduct from "@/actions/product/deleteProduct";
import getProductDatatable, {
  ProductDatatableInstance,
} from "@/actions/product/getProductDatatable";
import recoveryProduct from "@/actions/product/recoveryProduct";
import ProductCategoryChip from "@/components/Chips/ProductCategoryChip";
import ProductKeywordChips from "@/components/Chips/ProductKeywordChips";
import ProductStockStatusChip from "@/components/Chips/ProductStockStatusChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { StorePermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useRoute } from "@/hooks/use-route";
import { usePermission } from "@/providers/PermissionProvider";
import {
  DeleteTwoTone,
  QrCodeTwoTone,
  RestoreTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Box, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import BarcodeDialog from "./barcode-dialog";

const ProductDatatable = () => {
  const t = useTranslations("PRODUCTS.datatable");
  const f = useFormatter();
  const { enqueueSnackbar } = useSnackbar();

  const [barcodeProduct, setBarcodeProduct] =
    useState<ProductDatatableInstance | null>(null);
  const [showBarcode, setShowBarcode] = useState<boolean>(false);

  const [filterType, setFilterType] = useState<
    "all" | "preorder" | "outOfStock" | "stock" | "deleted"
  >("all");

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const permission = usePermission();
  const params = useParams<{ store: string }>();
  const route = useRoute();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(params.store, id),
    onSuccess: () => {
      enqueueSnackbar(t("confirmation.delete_success"), {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
        type: "active",
      });
    },
    onError: (error) => {
      enqueueSnackbar(t("confirmation.delete_error"));
    },
  });

  const recoveryMutation = useMutation({
    mutationFn: (id: number) => recoveryProduct(params.store, id),
    onSuccess: () => {
      enqueueSnackbar(t("confirmation.recovery_success"), {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["products"],
        type: "active",
      });
    },
    onError: (error) => {
      enqueueSnackbar(t("confirmation.recovery_error"));
    },
  });

  const confirmation = useConfirm({
    title: t("confirmation.delete_title"),
    text: t("confirmation.delete_text"),
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => deleteMutation.mutate(id),
  });

  const recoveryConfirmation = useConfirm({
    title: t("confirmation.recovery_title"),
    text: t("confirmation.recovery_text"),
    confirmProps: {
      color: "success",
      startIcon: <RestoreTwoTone />,
    },
    onConfirm: async (id: number) => recoveryMutation.mutate(id),
  });

  const menu = {
    recovery: React.useCallback(
      (product: ProductDatatableInstance) => () => {
        recoveryConfirmation.with(product.id);
        recoveryConfirmation.handleOpen();
      },
      [recoveryConfirmation],
    ),
    delete: React.useCallback(
      (product: ProductDatatableInstance) => () => {
        confirmation.with(product.id);
        confirmation.handleOpen();
      },
      [confirmation],
    ),
    barcode: React.useCallback(
      (product: ProductDatatableInstance) => () => {
        setBarcodeProduct(product);
        setShowBarcode(true);
      },
      [setShowBarcode],
    ),
  };

  const columns = React.useMemo((): GridColDef<ProductDatatableInstance>[] => {
    return [
      {
        field: "label",
        sortable: true,
        headerName: t("headers.label"),
        flex: 2,
        renderCell: ({ row }) => (
          <Stack justifyContent={"center"} height={"100%"}>
            <Typography variant="subtitle2">{row.label}</Typography>
            <Typography variant="caption" color="text.secondary">
              {row.serial}
            </Typography>
          </Stack>
        ),
      },
      {
        field: "status",
        headerName: t("headers.status"),
        flex: 1,
        sortable: false,
        renderCell: ({ row }) => (
          <ProductStockStatusChip
            quantity={row.stock?.quantity || 0}
            useAlert={row.stock?.useAlert}
            alertCount={row.stock?.alertCount}
            usePreorder={row.usePreorder}
          />
        ),
      },
      {
        field: "category.label",
        headerName: t("headers.category"),
        flex: 1,
        renderCell: ({ row }) => (
          <ProductCategoryChip label={row.category?.label} />
        ),
      },
      {
        field: "keywords",
        sortable: true,
        headerName: t("headers.keywords"),
        flex: 1,
        renderCell: ({ row }) => (
          <ProductKeywordChips keywords={row.keywords} />
        ),
      },
      {
        field: "price",
        sortable: true,
        headerName: t("headers.price"),
        type: "number",
        renderCell: ({ row }) => (
          <Typography color="primary.main">
            {f.number(row.price, "currency")}
          </Typography>
        ),
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        type: "number",
        renderCell: ({ row }) => (
          <Typography color="text.secondary">
            {f.number(row.cost, "currency")}
          </Typography>
        ),
      },
      {
        field: "profit",
        headerName: t("headers.profit"),
        sortable: false,
        type: "number",
        valueGetter: (params, row) => row.price - row.cost,
        renderCell: ({ row }) => (
          <Typography
            color={row.price - row.cost >= 0 ? "success.main" : "error.main"}
          >
            {f.number(row.price - row.cost, "currency")}
          </Typography>
        ),
      },
      {
        field: "margin",
        headerName: t("headers.margin"),
        sortable: false,
        type: "number",
        valueGetter: (params, row) => {
          if (row.price === 0) return 0;
          return ((row.price - row.cost) / row.price) * 100;
        },
        renderCell: ({ row }) => (
          <Tooltip
            title={`${f.number(((row.price - row.cost) / row.price) * 100, "percent")} Margin`}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              color={row.price - row.cost >= 0 ? "success.dark" : "error.dark"}
            >
              {f.number(((row.price - row.cost) / row.price) * 100, "percent")}
              {" %"}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "stock.quantity",
        sortable: true,
        headerName: t("headers.stock"),
        type: "number",
        renderCell: ({ row }) => f.number(row.stock?.quantity || 0),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 1,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={route.path("projects.store.products.product", {
              id: row.id.toString(),
            })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
          />,
          <GridActionsCellItem
            key="barcode"
            icon={<QrCodeTwoTone />}
            onClick={menu.barcode(row)}
            label={t("actions.barcode")}
          />,
          row.deleted_at ? (
            <GridActionsCellItem
              key="recovery"
              icon={<RestoreTwoTone />}
              onClick={menu.recovery(row)}
              label={t("actions.recovery")}
              disabled={
                !permission.hasStorePermission(
                  StorePermissionEnum.PRODUCT_MANAGEMENT,
                )
              }
              showInMenu
            />
          ) : (
            <GridActionsCellItem
              key="delete"
              icon={<DeleteTwoTone />}
              onClick={menu.delete(row)}
              label={t("actions.delete")}
              disabled={
                !permission.hasStorePermission(
                  StorePermissionEnum.PRODUCT_MANAGEMENT,
                )
              }
              showInMenu
            />
          ),
        ],
      },
    ];
  }, [t, user]);

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Tabs value={filterType} onChange={(_, value) => setFilterType(value)}>
          <Tab label={t("filters.all")} value="all" />
          <Tab label={t("filters.stock")} value="stock" />
          <Tab label={t("filters.out_of_stock")} value="outOfStock" />
          <Tab label={t("filters.preorder")} value="preorder" />
          <Tab label={t("filters.deleted")} value="deleted" />
        </Tabs>
      </Box>

      <Datatable
        name={"products"}
        columns={columns}
        fetch={getProductDatatable}
        bridge={[filterType]}
      />

      <Confirmation {...confirmation.props} />
      <Confirmation {...recoveryConfirmation.props} />
      <BarcodeDialog
        product={barcodeProduct}
        open={showBarcode}
        onClose={() => setShowBarcode(false)}
      />
    </>
  );
};

export default ProductDatatable;
