"use client";
import getOrderPreOrderProducts from "@/actions/order/getOrderPreOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PreOrderStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface OrderPreOrderDatatableProps {
  orderId: number;
}

const OrderPreOrderDatatable = ({ orderId }: OrderPreOrderDatatableProps) => {
  const t = useTranslations("HISTORIES.detail.datatable");
  const getStatusChip = (status: PreOrderStatus) => {
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
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.text(data.value),
      },
      {
        field: "returned_at",
        sortable: true,
        headerName: t("headers.returned_at"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => (data.value ? ff.date(data.value) : "-"),
      },
      {
        field: "returned_by",
        sortable: false,
        headerName: t("headers.returned_by"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.returned_by?.user?.name || "-",
      },
      {
        field: "cancelled_at",
        sortable: true,
        headerName: t("headers.cancelled_at"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => (data.value ? ff.date(data.value) : "-"),
      },
      {
        field: "cancelled_by",
        sortable: false,
        headerName: t("headers.cancelled_by"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.cancelled_by?.user?.name || "-",
      },
    ];
  };

  return (
    <Datatable
      name={`order-preorder-products-${orderId}`}
      columns={columns()}
      fetch={getOrderPreOrderProducts}
      bridge={[orderId]}
      height={600}
    />
  );
};

export default OrderPreOrderDatatable;
