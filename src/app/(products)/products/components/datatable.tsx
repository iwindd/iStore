"use client";
import DeleteProduct from "@/actions/product/delete";
import GetProducts from "@/actions/product/get";
import Datatable from "@/components/Datatable";
import { ProductPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import * as ff from "@/libs/formatter";
import { useInterface } from "@/providers/InterfaceProvider";
import { DeleteTwoTone, EditTwoTone, QrCodeTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Product } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { ProductFormDialog } from "./add-controller";
import BarcodeDialog from "./barcode-dialog";

const ProductDatatable = () => {
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
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบสินค้าหรือไม่",
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        const resp = await DeleteProduct(id);

        if (!resp.success) throw Error(resp.message);
        enqueueSnackbar("ลบรายการสินค้าสำเร็จแล้ว!", { variant: "success" });
        await queryClient.refetchQueries({
          queryKey: ["products"],
          type: "active",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง");
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
      { field: "serial", sortable: false, headerName: "รหัสสินค้า", flex: 1 },
      { field: "label", sortable: false, headerName: "ชื่อสินค้า", flex: 1 },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้สร้าง",
        flex: 1,
        renderCell: (data: any) => ff.text(data.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "keywords",
        sortable: true,
        headerName: "คีย์เวิร์ด",
        flex: 1,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "category",
        sortable: true,
        headerName: "ประเภทสินค้า",
        flex: 1,
        renderCell: ({ row }: any) => row.category?.label || "ไม่มีประเภท",
      },
      {
        field: "price",
        sortable: true,
        headerName: "ราคา",
        flex: 1,
        type: "number",
        renderCell: ({ value }) => ff.money(value),
      },
      {
        field: "cost",
        sortable: true,
        headerName: "ต้นทุน",
        flex: 1,
        type: "number",
        renderCell: ({ value }) => ff.money(value),
      },
      {
        field: "stock",
        sortable: true,
        headerName: "ของในสต๊อก",
        flex: 1,
        type: "number",
        renderCell: (data: any) => ff.number(data.value),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: Product }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoTone />}
            onClick={menu.edit(row)}
            label="แก้ไข"
            sx={{
              display: !permissions(row).canEditProduct ? "none" : undefined,
            }}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={menu.delete(row)}
            label="ลบ"
            sx={{
              display: !permissions(row).canRemoveProduct ? "none" : undefined,
            }}
            showInMenu
          />,
          <GridActionsCellItem
            key="barcode"
            icon={<QrCodeTwoTone />}
            onClick={menu.barcode(row)}
            label="แสดงบาร์โค้ด"
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
