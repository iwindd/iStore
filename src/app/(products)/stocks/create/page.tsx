"use client";
import createStock from "@/actions/stock/createStock";
import StockForm from "@/components/Forms/Stock";
import { Path } from "@/config/Path";
import { StockValues } from "@/schema/Stock";
import { Stock } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const CreateStockPage = () => {
  const router = useRouter();

  const createStockMutation = useMutation({
    mutationFn: async (data: StockValues) => createStock(data),
    onSuccess: (data: Stock) => {
      enqueueSnackbar({
        message: "สร้างสต๊อกสำเร็จแล้ว!",
        variant: "success",
      });
      router.push(`${Path("stocks").href}/${data.id}`);
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
