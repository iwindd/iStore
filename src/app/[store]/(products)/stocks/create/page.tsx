"use client";
import createStock from "@/actions/stock/createStock";
import StockForm from "@/components/Forms/Stock";
import { getPath } from "@/router";
import { StockValues } from "@/schema/Stock";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const CreateStockPage = () => {
  const t = useTranslations("STOCKS.create");
  const router = useRouter();

  const createStockMutation = useMutation({
    mutationFn: async (data: StockValues) => createStock(data),
    onSuccess: (data) => {
      enqueueSnackbar({
        message: t("success"),
        variant: "success",
      });
      router.push(getPath("store.stocks.stock", { id: data.id.toString() }));
    },
    onError: (error) => {
      console.error(error);
      enqueueSnackbar({
        message: t("error"),
        variant: "error",
      });
    },
  });

  return (
    <StockForm
      onSubmit={createStockMutation.mutate}
      isLoading={createStockMutation.isPending}
    />
  );
};

export default CreateStockPage;
