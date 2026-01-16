"use client";
import deleteCategory from "@/actions/category/deleteCategory";
import getCategoryDatatable from "@/actions/category/getCategoryDatatable";
import Datatable from "@/components/Datatable";
import { CategoryPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import { date, number, text } from "@/libs/formatter";
import { DeleteTwoTone, EditTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Category as OriginalCategory } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { CategoryFormDialog } from "./CategoryFormDialog";

interface Category extends OriginalCategory {
  _count: {
    product: number;
  };
}

const CategoryDatatable = () => {
  const editDialog = useDialog();
  const [category, setCategory] = React.useState<Category | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const permissions = (Category: Category) => ({
    canRemoveCategory:
      user?.hasPermission(CategoryPermissionEnum.DELETE) ||
      Category.creator_id === user?.userStoreId,
    canUpdateCategory:
      user?.hasPermission(CategoryPermissionEnum.UPDATE) ||
      Category.creator_id === user?.userStoreId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteCategory(id),
    onSuccess: async () => {
      enqueueSnackbar("ลบรายการประเภทสินค้าสำเร็จแล้ว!", {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
        type: "active",
      });
    },
    onError: () => {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    },
  });

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะลบประเภทสินค้าหรือไม่",
    confirmProps: {
      color: "error",
      startIcon: <DeleteTwoTone />,
    },
    onConfirm: async (id: number) => deleteMutation.mutate(id),
  });

  const editAction = React.useCallback(
    (category: Category) => () => {
      setCategory(category);
      editDialog.handleOpen();
    },
    [setCategory, editDialog]
  );

  const deleteAction = React.useCallback(
    (category: Category) => () => {
      confirmation.with(category.id);
      confirmation.handleOpen();
    },
    [confirmation]
  );

  const menu = React.useMemo(
    () => ({
      edit: editAction,
      delete: deleteAction,
    }),
    [editAction, deleteAction]
  );

  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันที่สร้าง",
        flex: 3,
        editable: false,
        renderCell: ({ value }) => date(value),
      },
      {
        field: "creator",
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
        field: "_count",
        sortable: false,
        headerName: "จำนวนสินค้า",
        flex: 2,
        editable: false,
        renderCell: ({ value }) => `${number(value.product)} รายการ`,
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
            disabled={!permissions(row).canUpdateCategory}
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
        fetch={getCategoryDatatable}
        height={700}
      />

      <CategoryFormDialog
        open={editDialog.open}
        onClose={editDialog.handleClose}
        category={category}
      />
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default CategoryDatatable;
