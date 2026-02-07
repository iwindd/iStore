"use client";
import getAllOrderProducts from "@/actions/order/getAllOrderProducts";
import OrderProductTypeChip, {
  OrderProductType,
} from "@/components/Chips/OrderProductTypeChip";
import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import Datatable from "@/components/Datatable";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useFormatter, useTranslations } from "next-intl";

interface AllProductsDatatableProps {
  orderId: number;
}

const AllProductsDatatable = ({ orderId }: AllProductsDatatableProps) => {
  const t = useTranslations("HISTORIES.detail.datatable");
  const f = useFormatter();

  const columns = (): GridColDef[] => {
    return [
      {
        field: "type",
        sortable: true,
        headerName: t("headers.type"),
        flex: 1,
        editable: false,
        renderCell: ({ value }) => <OrderProductTypeChip type={value} />,
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
        renderCell: (data: any) =>
          data.value ? f.number(data.value, "currency") : "-",
      },
      {
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => f.number(data.value, "currency"),
      },
      {
        field: "profit",
        sortable: true,
        headerName: t("headers.profit"),
        flex: 1,
        editable: false,
        renderCell: (data: any) =>
          data.value ? f.number(data.value, "currency") : "-",
      },
      {
        field: "count",
        sortable: true,
        headerName: t("headers.count"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) =>
          t("units.items", { count: f.number(data.value) }),
      },
      {
        field: "status",
        sortable: true,
        headerName: t("headers.status"),
        flex: 1,
        editable: false,
        renderCell: ({ value, row: { type } }) =>
          type === OrderProductType["PREORDER"] ? (
            <PreOrderStatusChip status={value} />
          ) : (
            "-"
          ),
      },
      {
        field: "promotions",
        sortable: false,
        headerName: t("headers.promotion"),
        flex: 1.2,
        editable: false,
        renderCell: (data: any) =>
          data.value ? (
            <Chip
              label={data.value}
              size="small"
              color="info"
              variant="outlined"
            />
          ) : (
            "-"
          ),
      },
      {
        field: "note",
        sortable: false,
        headerName: t("headers.note"),
        flex: 1,
        editable: false,
        renderCell: ({ value }) => value || "-",
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
