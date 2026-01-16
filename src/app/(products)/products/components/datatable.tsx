"use client";
import DeleteProduct from "@/actions/product/delete";
import GetProducts from "@/actions/product/get";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import * as ff from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { getPath } from "@/router";
import {
  DeleteTwoTone,
  EditTwoTone,
  QrCodeTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Product } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { ProductFormDialog } from "./add-controller";
import BarcodeDialog from "./barcode-dialog";

const ProductDatatable = () => {
  const t = useTranslations("PRODUCTS.datatable");
  const editDialog = useDialog();
  const { setBackdrop, isBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState<Product | null>(null);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);
  const [showBarcode, setShowBarcode] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const permissions = (product: Product) => ({
    canEditProduct:
      (product && user && product.creator_id == user.id) ||
      user?.hasPermission(ProductPermissionEnum.UPDATE),
    canRemoveProduct:
      (product && user && product.creator_id == user.id) ||
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
    edit: React.useCallback(
      (product: Product) => () => {
        setProduct(product);
        editDialog.handleOpen();
      },
      [editDialog, setProduct]
    ),
    delete: React.useCallback(
      (product: Product) => () => {
        confirmation.with(product.id);
        confirmation.handleOpen();
      },
      [confirmation]
    ),
    barcode: React.useCallback(
      (product: Product) => () => {
        setBarcodeProduct(product);
        setShowBarcode(true);
      },
      [setShowBarcode]
    ),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "serial",
        sortable: false,
        headerName: t("headers.serial"),
        flex: 1,
      },
      {
        field: "label",
        sortable: false,
        headerName: t("headers.label"),
        flex: 1,
      },
      {
        field: "creator",
        sortable: true,
        headerName: t("headers.creator"),
        flex: 1,
        renderCell: (data: any) =>
          ff.text(data.value?.user?.name || t("not_specified")),
      },
      {
        field: "keywords",
        sortable: true,
        headerName: t("headers.keywords"),
        flex: 1,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "category",
        sortable: true,
        headerName: t("headers.category"),
        flex: 1,
        renderCell: ({ row }: any) => row.category?.label || t("no_category"),
      },
      {
        field: "price",
        sortable: true,
        headerName: t("headers.price"),
        flex: 1,
        type: "number",
        renderCell: ({ value }) => ff.money(value),
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 1,
        type: "number",
        renderCell: ({ value }) => ff.money(value),
      },
      {
        field: "stock",
        sortable: true,
        headerName: t("headers.stock"),
        flex: 1,
        type: "number",
        renderCell: (data: any) => ff.number(data.value),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 1,
        getActions: ({ row }: { row: Product }) => [
          <GridLinkAction
            key="view"
            to={getPath("products.product", { id: row.id.toString() })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
            showInMenu
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoTone />}
            onClick={menu.edit(row)}
            label={t("actions.edit")}
            disabled={!permissions(row).canEditProduct}
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
          <GridActionsCellItem
            key="barcode"
            icon={<QrCodeTwoTone />}
            onClick={menu.barcode(row)}
            label={t("actions.barcode")}
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"products"}
        columns={columns()}
        fetch={GetProducts}
        height={700}
      />

      <ProductFormDialog
        open={editDialog.open && !isBackdrop}
        onClose={editDialog.handleClose}
        setLoading={setBackdrop}
        product={product}
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
