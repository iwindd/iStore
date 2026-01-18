"use client";
import DeleteProduct from "@/actions/product/delete";
import getProductDatatable, {
  ProductDatatableInstance,
} from "@/actions/product/getProductDatatable";
import ProductCategoryChip from "@/components/Chips/ProductCategoryChip";
import ProductKeywordChips from "@/components/Chips/ProductKeywordChips";
import ProductStockStatusChip from "@/components/Chips/ProductStockStatusChip";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import * as ff from "@/libs/formatter";
import { getPath } from "@/router";
import {
  DeleteTwoTone,
  QrCodeTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { Box, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import BarcodeDialog from "./barcode-dialog";

const ProductDatatable = () => {
  const t = useTranslations("PRODUCTS.datatable");
  const { enqueueSnackbar } = useSnackbar();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [barcodeProduct, setBarcodeProduct] =
    useState<ProductDatatableInstance | null>(null);
  const [showBarcode, setShowBarcode] = useState<boolean>(false);

  const currentFilter = searchParams.get("filter") as any;
  const [filterType, setFilterType] = useState<
    "all" | "preorder" | "outOfStock" | "stock" | "deleted"
  >(
    ["all", "preorder", "outOfStock", "stock", "deleted"].includes(
      currentFilter,
    )
      ? currentFilter
      : "all",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterType === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filterType);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [filterType, pathname, router, searchParams]);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const permissions = (product: ProductDatatableInstance) => ({
    canEditProduct:
      (product && user && product.creator?.user.id == user.id) ||
      user?.hasPermission(ProductPermissionEnum.UPDATE),
    canRemoveProduct:
      (product && user && product.creator?.user.id == user.id) ||
      user?.hasPermission(ProductPermissionEnum.DELETE),
  });

  const confirmation = useConfirm({
    title: t("confirmation.delete_title"),
    text: t("confirmation.delete_text"),
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        const resp = await DeleteProduct(id);

        if (!resp.success) throw new Error(resp.message);
        enqueueSnackbar(t("confirmation.delete_success"), {
          variant: "success",
        });
        await queryClient.refetchQueries({
          queryKey: ["products"],
          type: "active",
        });
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t("confirmation.delete_error"));
      }
    },
  });

  const menu = {
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

  const columns = (): GridColDef<ProductDatatableInstance>[] => {
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
        field: "category",
        sortable: true,
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
        flex: 0.7,
        type: "number",
        renderCell: ({ row }) => (
          <Typography color="primary.main">{ff.money(row.price)}</Typography>
        ),
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 0.7,
        type: "number",
        renderCell: ({ row }) => (
          <Typography color="text.secondary">{ff.money(row.cost)}</Typography>
        ),
      },
      {
        field: "profit",
        headerName: t("headers.profit"),
        flex: 0.7,
        type: "number",
        valueGetter: (params, row) => row.price - row.cost,
        renderCell: ({ row }) => (
          <Typography
            color={row.price - row.cost >= 0 ? "success.main" : "error.main"}
          >
            {ff.money(row.price - row.cost)}
          </Typography>
        ),
      },
      {
        field: "margin",
        headerName: t("headers.margin"),
        flex: 0.7,
        type: "number",
        valueGetter: (params, row) => {
          if (row.price === 0) return 0;
          return ((row.price - row.cost) / row.price) * 100;
        },
        renderCell: ({ row }) => (
          <Tooltip
            title={`${((row.price - row.cost) / row.price) * 100} Margin`}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              color={row.price - row.cost >= 0 ? "success.dark" : "error.dark"}
            >
              {ff.number(((row.price - row.cost) / row.price) * 100)}%
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: "stock",
        sortable: true,
        headerName: t("headers.stock"),
        flex: 0.8,
        type: "number",
        renderCell: ({ row }) => ff.number(row.stock?.quantity || 0),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 0.7,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={getPath("products.product", { id: row.id.toString() })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
          <GridActionsCellItem
            key="barcode"
            icon={<QrCodeTwoTone />}
            onClick={menu.barcode(row)}
            label={t("actions.barcode")}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={menu.delete(row)}
            label={t("actions.delete")}
            disabled={!permissions(row).canRemoveProduct}
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={filterType}
          onChange={(_, value) => setFilterType(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label={t("filters.all")} value="all" />
          <Tab label={t("filters.stock")} value="stock" />
          <Tab label={t("filters.out_of_stock")} value="outOfStock" />
          <Tab label={t("filters.preorder")} value="preorder" />
          <Tab label={t("filters.deleted")} value="deleted" />
        </Tabs>
      </Box>

      <Datatable
        name={"products"}
        columns={columns()}
        fetch={getProductDatatable}
        bridge={[filterType]}
        height={700}
      />

      <Confirmation {...confirmation.props} />
      <BarcodeDialog
        product={barcodeProduct}
        open={showBarcode}
        onClose={() => setShowBarcode(false)}
      />
    </>
  );
};

export default ProductDatatable;
