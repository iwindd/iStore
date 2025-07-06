"use client";
import React, { useState } from "react";
import * as ff from "@/libs/formatter";
import { EditTwoTone } from "@mui/icons-material";
import { Role } from "@prisma/client";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import Datatable from "@/components/Datatable";
import * as RoleActions from "@/actions/roles";
import RoleFormDialog from "@/app/roles/components/roleFormDialog";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";

const RoleDatatable = () => {
  const editDialog = useDialog();
  const { isBackdrop } = useInterface();
  const [role, setRole] = useState<Role | null>(null);

  const menu = {
    edit: React.useCallback((role: Role) => () => {
      setRole(role);
      editDialog.handleOpen();
    }, []),
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันที่เพิ่ม",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.date(data.value),
      },
      {
        field: "user_store",
        sortable: true,
        headerName: "ผู้เพิ่ม",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.text(data?.value?.user?.name || "ไม่ระบุ"),
      },
      {
        field: "label",
        sortable: true,
        headerName: "ชื่อตำแหน่ง",
        flex: 1,
        editable: false,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: { row: Role }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditTwoTone />}
            onClick={menu.edit(row)}
            label="แก้ไข"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <>
      <Datatable
        name={"roles"}
        columns={columns()}
        fetch={RoleActions.datatable}
        height={700}
      />

      <RoleFormDialog
        isOpen={editDialog.open && !isBackdrop}
        onClose={editDialog.handleClose}
        role={role}
      />
    </>
  );
};

export default RoleDatatable;
