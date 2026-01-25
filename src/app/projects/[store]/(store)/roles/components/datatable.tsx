"use client";
import { getRoleDatatable } from "@/actions/roles/getStoreRoleDatatable";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { EditTwoTone } from "@mui/icons-material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { StoreRole } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const RoleDatatable = () => {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.store as string;

  const menu = {
    edit: React.useCallback(
      (role: StoreRole) => () => {
        router.push(`/projects/${storeSlug}/roles/${role.id}`);
      },
      [router, storeSlug],
    ),
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
        field: "creator",
        sortable: true,
        headerName: "ผู้เพิ่ม",
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          data?.value?.user
            ? `${data?.value?.user?.first_name} ${data?.value?.user?.last_name}`
            : "-",
      },
      {
        field: "name",
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
        getActions: ({ row }: { row: StoreRole }) => [
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
    <Datatable
      name={"roles"}
      columns={columns()}
      fetch={getRoleDatatable}
      height={700}
    />
  );
};

export default RoleDatatable;
