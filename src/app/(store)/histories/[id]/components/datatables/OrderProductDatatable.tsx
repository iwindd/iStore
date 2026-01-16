"use client";
import getOrderProducts from "@/actions/order/getOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";

interface OrderProductDatatableProps {
  orderId: number;
}

const OrderProductDatatable = ({ orderId }: OrderProductDatatableProps) => {
  const t = useTranslations("HISTORIES.detail.datatable");
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
      name={`order-products-${orderId}`}
      columns={columns()}
      fetch={getOrderProducts}
      bridge={[orderId]}
      height={600}
    />
  );
};

export default OrderProductDatatable;
