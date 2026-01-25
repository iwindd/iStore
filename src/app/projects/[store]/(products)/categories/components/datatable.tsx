"use client";
import deleteCategory from "@/actions/category/deleteCategory";
import getCategoryDatatable from "@/actions/category/getCategoryDatatable";
import Datatable from "@/components/Datatable";
import { StorePermissionEnum } from "@/enums/permission";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import { date, number } from "@/libs/formatter";
import { usePermission } from "@/providers/PermissionProvider";
import { DeleteTwoTone, EditTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Category as OriginalCategory } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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
  const params = useParams<{ store: string }>();
  const hasPermission = usePermission().hasStorePermission(
    StorePermissionEnum.PRODUCT_MANAGEMENT,
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => await deleteCategory(params.store, id),
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
          data.value?.user
            ? data.value?.user?.first_name + " " + data.value?.user?.last_name
            : t("placeholders.not_specified"),
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
            onClick={() => {
              setCategory(row);
              editDialog.handleOpen();
            }}
            label={t("actions.edit")}
            disabled={!hasPermission}
            showInMenu
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteTwoTone />}
            onClick={() => {
              confirmation.with(row.id);
              confirmation.handleOpen();
            }}
            label={t("actions.delete")}
            disabled={!hasPermission}
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

      {hasPermission && (
        <>
          <CategoryFormDialog
            open={editDialog.open}
            onClose={editDialog.handleClose}
            category={category}
          />

          <Confirmation {...confirmation.props} />
        </>
      )}
    </>
  );
};

export default CategoryDatatable;
