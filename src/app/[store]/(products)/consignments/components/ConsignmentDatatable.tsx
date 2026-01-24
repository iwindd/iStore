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
import { ConsignmentStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

const ConsignmentDatatable = () => {
  const t = useTranslations("CONSIGNMENTS.datatable");
  const ts = useTranslations("CONSIGNMENTS.status");

  const translateStatus = (status: ConsignmentStatus) => {
    switch (status) {
      case ConsignmentStatus.PENDING:
        return ts("pending");
      case ConsignmentStatus.COMPLETED:
        return ts("completed");
      case ConsignmentStatus.CANCELLED:
        return ts("cancelled");
      default:
        return status;
    }
  };

  const columns = (): GridColDef<ConsignmentDatatableInstance>[] => {
    return [
      {
        field: "created_at",
        sortable: true,
        headerName: t("headers.date"),
        flex: 2,
        renderCell: ({ row }) => ff.date(row.created_at),
      },
      {
        field: "creator",
        sortable: true,
        headerName: t("headers.creator"),
        flex: 2,
        renderCell: ({ row }) => ff.text(row.creator?.user.name),
      },
      {
        field: "_count",
        headerName: t("headers.count"),
        flex: 1,
        renderCell: ({ row }) =>
          t("items_unit", { count: ff.number(row._count.products) }),
      },
      {
        field: "note",
        headerName: t("headers.note"),
        flex: 3,
        renderCell: ({ row }) => row.note || t("not_specified"),
      },
      {
        field: "status",
        headerName: t("headers.status"),
        flex: 2,
        renderCell: ({ row }) => translateStatus(row.status),
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("headers.actions"),
        flex: 1,
        getActions: ({ row }) => [
          <GridLinkAction
            key="view"
            to={getPath("store.consignments.consignment", {
              id: row.id.toString(),
            })}
            icon={<ViewAgendaTwoTone />}
            label={t("actions.view")}
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
