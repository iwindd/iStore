"use client";
import fetchConsignmentDatatable, {
  ConsignmentDatatableInstance,
} from "@/actions/consignment/fetchConsignmentDatatable";
import Datatable from "@/components/Datatable";
import GridLinkAction from "@/components/GridLinkAction";
import { Colorization } from "@/libs/colorization";
import * as ff from "@/libs/formatter";
import { getPath } from "@/router";
import { ViewAgendaTwoTone } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

const ConsignmentDatatable = () => {
  const columns = (): GridColDef<ConsignmentDatatableInstance>[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: "วันที่ทำรายการ",
        flex: 2,
        renderCell: ({ row }) => ff.date(row.created_at),
      },
      {
        field: "creator",
        sortable: true,
        headerName: "ผู้จัดทำ",
        flex: 2,
        renderCell: ({ row }) => ff.text(row.creator?.user.name),
      },
      {
        field: "_count",
        headerName: "จำนวนรายการ",
        flex: 1,
        renderCell: ({ row }) => `${ff.number(row._count.products)} รายการ`,
      },
      {
        field: "note",
        headerName: "หมายเหตุ",
        flex: 3,
        renderCell: ({ row }) => row.note || "ไม่ระบุ",
      },
      {
        field: "status",
        headerName: "สถานะ",
        flex: 2,
        renderCell: ({ row }) => ff.consignmentStatus(row.status),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "เครื่องมือ",
        flex: 1,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={getPath("consignments.consignment", { id: row.id.toString() })}
            icon={<ViewAgendaTwoTone />}
            label="ดูรายละเอียด"
            showInMenu
          />,
        ],
      },
    ];
  };

  return (
    <Datatable
      name={"consignments_datatable"}
      columns={columns()}
      fetch={fetchConsignmentDatatable}
      height={700}
      getCellClassName={Colorization.getGridCellColorForConsignmentStatus}
    />
  );
};

export default ConsignmentDatatable;
