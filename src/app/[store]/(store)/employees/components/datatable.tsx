"use client";
import * as EmployeeActions from "@/actions/employee";
import Datatable from "@/components/Datatable";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { DeleteTwoTone, EditTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import UserFormDialog from "./userFormDialog";

const EmployeeDatatable = () => {
  const editDialog = useDialog();
  const [user, setUser] = React.useState<User | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { isBackdrop } = useInterface();

  const menu = {
    edit: React.useCallback(
      (user: User) => () => {
        setUser(user);
        editDialog.handleOpen();
      },
      [setUser, editDialog]
    ),
    delete: React.useCallback((user: User) => () => {}, []),
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
        field: "creator",
        sortable: true,
        headerName: "ผู้เพิ่ม",
        flex: 2,
        editable: false,
        renderCell: ({ row }) =>
          row?.employees[0]?.creator?.user?.name || "ไม่ระบุ",
      },
      {
        field: "email",
        sortable: false,
        headerName: "อีเมล",
        flex: 3,
        editable: false,
      },
      {
        field: "employees",
        sortable: false,
        headerName: "ตำแหน่ง",
        flex: 3,
        editable: false,
        renderCell: ({ row }: any) => row.employees[0]?.role.label || "ไม่ระบุ",
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
