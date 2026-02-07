"use client";
import getAllOrderProducts from "@/actions/order/getAllOrderProducts";
import Datatable from "@/components/Datatable";
import * as ff from "@/libs/formatter";
import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useTranslations } from "next-intl";

interface PromotionDatatableProps {
  orderId: number;
}

const PromotionDatatable = ({ orderId }: PromotionDatatableProps) => {
  const t = useTranslations("HISTORIES.detail.datatable");
  const columns = (): GridColDef[] => {
    return [
      {
        field: "promotions",
        sortable: true,
        headerName: t("headers.promotion"),
        flex: 1.5,
        editable: false,
        renderCell: (data: any) => (
          <Chip
            label={data.value}
            size="small"
            color="info"
            variant="outlined"
          />
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
        field: "cost",
        sortable: true,
        headerName: t("headers.cost"),
        flex: 1,
        editable: false,
        renderCell: (data: any) => ff.money(data.value),
      },

      {
        field: "received_count",
        sortable: true,
        headerName: t("headers.received_count"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) => t("units.items", { count: data.value }),
      },
      {
        field: "free_count",
        sortable: true,
        headerName: t("headers.free_count"),
        flex: 0.8,
        editable: false,
        renderCell: (data: any) => t("units.items", { count: data.value }),
      },
    ];
  };

  const fetchPromotions = async (table: any, ...args: any[]) => {
    return await getAllOrderProducts(
      {
        ...table,
        filter: {
          ...table.filter,
          items: [
            ...(table.filter?.items || []),
            { field: "type", operator: "equals", value: "PROMOTION" },
          ],
        },
      },
      args[0],
    );
  };

  return (
    <Datatable
      name={`promotion-order-products-${orderId}`}
      columns={columns()}
      fetch={fetchPromotions}
      bridge={[orderId]}
      height={600}
    />
  );
};

export default PromotionDatatable;
