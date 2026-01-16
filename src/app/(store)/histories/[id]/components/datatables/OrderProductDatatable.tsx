"use client";
import getOrderProducts from "@/actions/order/getOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { GridColDef } from "@mui/x-data-grid";

interface OrderProductDatatableProps {
  orderId: number;
}

const OrderProductDatatable = ({ orderId }: OrderProductDatatableProps) => {
  const columns = (): GridColDef[] => {
    return [
      {
        field: "product.serial",
        sortable: true,
        headerName: "รหัสสินค้า",
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.product.serial,
      },
      {
        field: "product.label",
        sortable: true,
        headerName: "ชื่อสินค้า",
        flex: 1.5,
        editable: false,
        renderCell: (data: any) => data.row.product.label,
      },
      {
        field: "product.category.label",
        sortable: true,
        headerName: "ประเภทสินค้า",
        flex: 1,
        editable: false,
        renderCell: (data: any) => data.row.product.category?.label || "-",
      },
      {
        field: "total",
        sortable: true,
        headerName: "ราคา",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "cost",
        sortable: true,
        headerName: "ต้นทุน",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "profit",
        sortable: true,
        headerName: "กำไร",
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },
      {
        field: "count",
        sortable: true,
        headerName: "จำนวน",
        flex: 0.8,
        editable: false,
        renderCell: (data: any) => `${data.value} รายการ`,
      },
      {
        field: "note",
        sortable: false,
        headerName: "หมายเหตุ",
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
