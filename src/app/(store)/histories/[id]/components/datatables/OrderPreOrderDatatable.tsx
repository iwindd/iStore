"use client";
import getOrderPreOrderProducts from "@/actions/order/getOrderPreOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PreOrderStatus } from "@prisma/client";

interface OrderPreOrderDatatableProps {
  orderId: number;
}

const OrderPreOrderDatatable = ({ orderId }: OrderPreOrderDatatableProps) => {
  const getStatusChip = (status: PreOrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Chip label="รอดำเนินการ" color="warning" size="small" />;
      case "RETURNED":
        return <Chip label="คืนแล้ว" color="success" size="small" />;
      case "CANCELLED":
        return <Chip label="ยกเลิก" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

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
        field: "status",
        sortable: true,
        headerName: "สถานะ",
        flex: 1,
        editable: false,
        renderCell: (data: any) => getStatusChip(data.value),
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
      name={`order-preorder-products-${orderId}`}
      columns={columns()}
      fetch={getOrderPreOrderProducts}
      bridge={[orderId]}
      height={600}
    />
  );
};

export default OrderPreOrderDatatable;
