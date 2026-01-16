"use client";
import getAllOrderProducts from "@/actions/order/getAllOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PreOrderStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface AllProductsDatatableProps {
  orderId: number;
}

const AllProductsDatatable = ({ orderId }: AllProductsDatatableProps) => {
  const t = useTranslations("HISTORIES.detail.datatable");
  const getStatusChip = (status: PreOrderStatus | null) => {
    if (!status) return "-";

    switch (status) {
      case "PENDING":
        return (
          <Chip label={t("statuses.PENDING")} color="warning" size="small" />
        );
      case "RETURNED":
        return (
          <Chip label={t("statuses.RETURNED")} color="success" size="small" />
        );
      case "CANCELLED":
        return (
          <Chip label={t("statuses.CANCELLED")} color="error" size="small" />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const columns = (): GridColDef[] => {
    return [
      {
        field: "type",
        sortable: true,
        headerName: t("headers.type"),
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          data.value === "PRODUCT" ? (
            <Chip label={t("types.product")} color="primary" size="small" />
          ) : (
            <Chip label={t("types.preorder")} color="secondary" size="small" />
          ),
      },
      {
        field: "product.serial",
        sortable: true,
        headerName: t("headers.serial"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.product.serial,
      },
      {
        field: "product.label",
        sortable: true,
        headerName: t("headers.label"),
        flex: 1.5,
        editable: false,
        renderCell: (data: any) => data.row.product.label,
      },
      {
        field: "product.category.label",
        sortable: true,
        headerName: t("headers.category"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.product.category?.label || "-",
      },
      {
        field: "total",
        sortable: true,
        headerName: t("headers.price"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "profit",
        sortable: true,
        headerName: t("headers.profit"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "count",
        sortable: true,
        headerName: t("headers.count"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) => t("units.items", { count: data.value }),
      },
      {
        field: "status",
        sortable: true,
        headerName: t("headers.status"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => getStatusChip(data.value),
      },
      {
        field: "note",
        sortable: false,
        headerName: t("headers.note"),
        flex: 1.2,
        editable: false,
        renderCell: (data: any) => ff.text(data.value),
      },
    ];
  };

  return (
    <Datatable
      name={`all-order-products-${orderId}`}
      columns={columns()}
      fetch={getAllOrderProducts}
      bridge={[orderId]}
      height={600}
    />
  );
};

export default AllProductsDatatable;
