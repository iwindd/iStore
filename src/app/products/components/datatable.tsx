"use client";
import React, { useState } from "react";
import * as ff from "@/libs/formatter";
import {
  DeleteTwoTone,
  EditTwoTone,
  QrCodeTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useDialog } from "@/hooks/use-dialog";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import Datatable from "@/components/Datatable";
import { useInterface } from "@/providers/InterfaceProvider";
import { Category, Product } from "@prisma/client";
import GetProducts from "@/actions/product/get";
import DeleteProduct from "@/actions/product/delete";
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
        renderCell: ({row}: any) => row.category?.label || "ไม่มีประเภท",
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
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={menu.delete(row)}
            label="ลบ"
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
