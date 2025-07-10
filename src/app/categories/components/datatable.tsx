"use client";
import React from "react";
import Datatable from "@/components/Datatable";
import {
  DeleteTwoTone,
  EditTwoTone,
  ViewAgendaTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import GridLinkAction from "@/components/GridLinkAction";
import { Category as OriginalCategory } from "@prisma/client";
import { Path } from "@/config/Path";
import GetCategories from "@/actions/category/get";
import { CategoryFormDialog } from "./add-controller";
import { useDialog } from "@/hooks/use-dialog";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import DeleteCategory from "@/actions/category/delete";
import { date, number, text } from "@/libs/formatter";
import { useAuth } from "@/hooks/use-auth";
import { CategoryPermissionEnum } from "@/enums/permission";

interface Category extends OriginalCategory{
  _count: {
    product: number
  }
}

const CategoryDatatable = () => {
  const editDialog = useDialog();
  const [category, setCategory] = React.useState<Category | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const permissions = (Category: Category) => ({
    canRemoveCategory: user?.hasPermission(CategoryPermissionEnum.DELETE) || Category.user_store_id === user?.userStoreId,
    canUpdateCategory: user?.hasPermission(CategoryPermissionEnum.UPDATE) || Category.user_store_id === user?.userStoreId,
  })

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบประเภทสินค้าหรือไม่",
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => {
      try {
        const resp = await DeleteCategory(id);

        if (!resp.success) throw Error("error");
        enqueueSnackbar("ลบรายการประเภทสินค้าสำเร็จแล้ว!", {
          variant: "success",
        });
        await queryClient.refetchQueries({
          queryKey: ["categories"],
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
    edit: React.useCallback(
      (category: Category) => () => {
        setCategory(category);
        editDialog.handleOpen();
      },
      [setCategory, editDialog]
    ),
    delete: React.useCallback(
      (category: Category) => () => {
        confirmation.with(category.id);
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
        headerName: "วันที่สร้าง",
        flex: 3,
        editable: false,
        renderCell: ({value}) => date(value)
      },
      {
        field: "user_store", 
        sortable: true, 
        headerName: "ผู้สร้าง", 
        flex: 3,
        renderCell: (data: any) => text(data.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "label",
        sortable: true,
        headerName: "ประเภทสินค้า",
        flex: 3,
        editable: false,
      },
      {
        field: "overstock",
        sortable: false,
        headerName: "การเบิก",
        flex: 2,
        editable: false,
        renderCell: ({value}) => value ? "อณุญาต" : "ไม่อนุญาต"
      },
      {
        field: "_count",
        sortable: false,
        headerName: "จำนวนสินค้า",
        flex: 2,
        editable: false,
        renderCell: ({value}) => `${number(value.product)} รายการ`
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 2,
        getActions: ({ row }: { row: Category }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoTone />}
            onClick={menu.edit(row)}
            label="แก้ไข"
            sx={{display: !permissions(row).canUpdateCategory ? 'none' : undefined}}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={menu.delete(row)}
            label="ลบ"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"categories"}
        columns={columns()}
        fetch={GetCategories}
        height={700}
      />

      <CategoryFormDialog open={editDialog.open} onClose={editDialog.handleClose} category={category} />
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default CategoryDatatable;
