"use client";
import updateStock from "@/actions/stock/updateStock";
import StockForm from "@/components/Forms/Stock";
import { StockValues } from "@/schema/Stock";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { StockLayoutValue } from "./layout";
import { useStock } from "./StockContext";

const StockDetailPage = () => {
  const t = useTranslations("STOCKS.detail");
  const { stock, setStock } = useStock();
  const params = useParams<{ store: string }>();

  const updateStockMutation = useMutation({
    mutationFn: async (data: StockValues) =>
      updateStock(params.store, data, stock.id),
    onSuccess: (stock: StockLayoutValue) => {
      setStock(stock);
      enqueueSnackbar({
        message: t("save_success"),
        variant: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar({
        message: t("save_error"),
        variant: "error",
      });
    },
  });

  return (
    <StockForm
      stock={stock}
      onSubmit={updateStockMutation.mutate}
      isLoading={updateStockMutation.isPending}
    />
  );
};

export default StockDetailPage;
