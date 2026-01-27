"use client";
import getStoreEmployeeDatatable from "@/actions/employee/getStoreEmployeeDatatable";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { useRoute } from "@/hooks/use-route";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

const EmployeeDatatable = () => {
  const route = useRoute();

  const columns = (): GridColDef[] => {
    return [
      {
        field: "name",
        sortable: true,
        headerName: "ชื่อพนักงาน",
        flex: 3,
        editable: false,
        renderCell: ({ row }) =>
          row?.first_name ? `${row?.first_name} ${row?.last_name}` : "ไม่ระบุ",
      },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้เพิ่ม",
        flex: 2,
        editable: false,
        renderCell: ({ row }) =>
          row?.employees[0]?.creator?.user
            ? `${row?.employees[0]?.creator?.user?.first_name} ${row?.employees[0]?.creator?.user?.last_name}`
            : "ไม่ระบุ",
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
        renderCell: ({ row }: any) => row.employees[0]?.role.name || "ไม่ระบุ",
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }: any) => [
          <GridLinkAction
            key="view"
            to={route.path("projects.store.employees.employee", {
              employeeId: row.employees[0]?.id.toString(),
            })}
            icon={<ViewAgendaTwoTone />}
            label="รายละเอียด"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <Datatable
      name={"employees"}
      columns={columns()}
      fetch={getStoreEmployeeDatatable}
      height={700}
    />
  );
};

export default EmployeeDatatable;
