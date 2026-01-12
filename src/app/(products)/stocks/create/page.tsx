"use client";
import createStock from "@/actions/stock/createStock";
import StockForm from "@/components/Forms/Stock";
import { getPath } from "@/router";
import { StockValues } from "@/schema/Stock";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const CreateStockPage = () => {
  const router = useRouter();

  const createStockMutation = useMutation({
    mutationFn: async (data: StockValues) => createStock(data),
    onSuccess: (data) => {
      enqueueSnackbar({
        message: "สร้างสต๊อกสำเร็จแล้ว!",
        variant: "success",
      });
      router.push(getPath("stocks.stock", { id: data.id.toString() }));
    },
    onError: (error) => {
      enqueueSnackbar({
        message: "ไม่สามารถสร้างสต๊อกได้! กรุณาลองใหม่อีกครั้งในภายหลัง",
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
