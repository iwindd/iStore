"use client";
import createStockReceipt from "@/actions/stock/createStockReceipt";
import StockForm from "@/components/Forms/Stock";
import { useRoute } from "@/hooks/use-route";
import { StockValues } from "@/schema/Stock";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const CreateStockPage = () => {
  const t = useTranslations("STOCKS.create");
  const route = useRoute();
  const params = useParams<{ store: string }>();

  const createStockMutation = useMutation({
    mutationFn: async (data: StockValues) =>
      createStockReceipt(params.store, data),
    onSuccess: (data) => {
      enqueueSnackbar({
        message: t("success"),
        variant: "success",
      });
      route.push("projects.store.stocks.stock", { id: data.id.toString() });
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
