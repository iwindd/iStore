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
import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import React from "react";
import { CategoryFormDialog } from "./CategoryFormDialog";

interface Category extends OriginalCategory {
  _count: {
    product: number;
  };
}

const CategoryDatatable = () => {
  const t = useTranslations("CATEGORIES.datatable");
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
      enqueueSnackbar(t("delete_success"), {
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["categories"],
        type: "active",
      });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar(t("delete_error"), {
        variant: "error",
      });
    },
  });

  const confirmation = useConfirm({
    title: t("confirmation.title"),
    text: t("confirmation.text"),
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
        headerName: t("headers.created_at"),
        flex: 3,
        editable: false,
        renderCell: ({ value }) => date(value),
      },
      {
        field: "creator",
        sortable: true,
        headerName: t("headers.creator"),
        flex: 3,
        renderCell: (data: any) =>
          text(data.value?.user?.name || t("placeholders.not_specified")),
      },
      {
        field: "label",
        sortable: true,
        headerName: t("headers.label"),
        flex: 3,
        editable: false,
      },

      {
        field: "_count",
        sortable: false,
        headerName: t("headers.count"),
        flex: 2,
        editable: false,
        renderCell: ({ value }) =>
          t("units.items", { count: number(value.product) }),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 2,
        getActions: ({ row }: { row: Category }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoTone />}
            onClick={menu.edit(row)}
            label={t("actions.edit")}
            disabled={!permissions(row).canUpdateCategory}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={menu.delete(row)}
            label={t("actions.delete")}
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
