"use client";
import React from "react";
import Datatable from "@/components/Datatable";
import {
  DeleteTwoTone,
  EditTwoTone,
} from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Category as OriginalCategory, User } from "@prisma/client";
import { useDialog } from "@/hooks/use-dialog";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { date, number } from "@/libs/formatter";
import * as EmployeeActions from "@/actions/employee";
import UserFormDialog from "./userFormDialog";
import { useInterface } from "@/providers/InterfaceProvider";

const EmployeeDatatable = () => {
  const editDialog = useDialog();
  const [user, setUser] = React.useState<User | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { isBackdrop } = useInterface();

  const menu = {
    edit: React.useCallback((user: User) => () => {
      setUser(user);
      editDialog.handleOpen();
    }, [setUser, editDialog]),
    delete: React.useCallback((user: User) => () => {

    }, []),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "name",
        sortable: true,
        headerName: "ชื่อพนักงาน",
        flex: 3,
        editable: false,
      },
      {
        field: "user_store",
        sortable: true,
        headerName: "ผู้เพิ่ม",
        flex: 2,
        editable: false,
        renderCell: ({row}) => row?.userStores[0]?.user_store?.user?.name ||  "ไม่ระบุ",
      },
      {
        field: "email",
        sortable: false,
        headerName: "อีเมล",
        flex: 3,
        editable: false,
      },
      {
        field: "userStores",
        sortable: false,
        headerName: "ตำแหน่ง",
        flex: 3,
        editable: false,
        renderCell: ({row}: any) => row.userStores[0]?.role.label || "ไม่ระบุ",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: User }) => [
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
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"employees"}
        columns={columns()}
        fetch={EmployeeActions.datatable}
        height={700}
      />

      <UserFormDialog
        isOpen={editDialog.open && !isBackdrop}
        onClose={editDialog.handleClose}
        user={user}
      />
    </>
  );
};

export default EmployeeDatatable;
