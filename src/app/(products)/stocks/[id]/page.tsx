"use client";
import updateStock from "@/actions/stock/updateStock";
import StockForm from "@/components/Forms/Stock";
import { StockValues } from "@/schema/Stock";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useStock } from "./StockContext";
import { StockLayoutValue } from "./layout";

const StockDetailPage = () => {
  const { stock, setStock } = useStock();

  const updateStockMutation = useMutation({
    mutationFn: async (data: StockValues) => updateStock(data, stock.id),
    onSuccess: (stock: StockLayoutValue) => {
      setStock(stock);
      enqueueSnackbar({
        message: "บันทึกสต๊อกแล้ว!",
        variant: "success",
      });
    },
    onError: (error) => {
      enqueueSnackbar({
        message: "ไม่สามารถบันทึกสต๊อกได้! กรุณาลองใหม่อีกครั้งในภายหลัง",
        variant: "error",
      });
    },
  });

  return <StockForm stock={stock} onSubmit={updateStockMutation.mutate} />;
};

export default StockDetailPage;
