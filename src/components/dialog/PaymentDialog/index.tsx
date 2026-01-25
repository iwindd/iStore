"use client";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useInterface } from "@/providers/InterfaceProvider";
import {
  cashoutCart,
  CheckoutMode,
  consignmentCart,
} from "@/reducers/cartReducer";
import { CashoutInputValues, ConsignmentInputValues } from "@/schema/Payment";
import { useQueryClient } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import CashoutContent from "./components/CashoutContent";
import ConsignmentContent from "./components/ConsignmentContent";

export interface PaymentDialogProps {
  open: boolean;
  onClose(): void;
}

export interface PaymentDialogContentProps extends PaymentDialogProps {
  total: number;
  onSubmit(payload: any, form: UseFormReturn<any>): void;
}

const PaymentDialog = ({ open, onClose }: PaymentDialogProps) => {
  const { setBackdrop } = useInterface();
  const checkoutMode = useAppSelector((state) => state.cart.checkoutMode);
  const totalProduct = useAppSelector((state) => state.cart.total);
  const totalPreOrder = useAppSelector((state) => state.cart.totalPreOrder);
  const total = totalProduct + totalPreOrder;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const onCashout = async (
    data: CashoutInputValues,
    form: UseFormReturn<CashoutInputValues>,
  ) => {
    setBackdrop(true);
    const resp = await dispatch(cashoutCart(data));
    if (resp.meta.requestStatus == "fulfilled") {
      form.reset();
      onClose();

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["preorders"] });
    }

    setBackdrop(false);
  };

  const onConsignment = async (
    data: ConsignmentInputValues,
    form: UseFormReturn<ConsignmentInputValues>,
  ) => {
    setBackdrop(true);
    const resp = await dispatch(consignmentCart(data));
    if (resp.meta.requestStatus == "fulfilled") {
      form.reset();
      onClose();
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["consignments"] });
    }
    setBackdrop(false);
  };

  return checkoutMode === CheckoutMode.CONSIGNMENT ? (
    <ConsignmentContent
      open={open}
      onClose={onClose}
      onSubmit={onConsignment}
      total={totalProduct}
    />
  ) : (
    <CashoutContent
      open={open}
      onClose={onClose}
      onSubmit={onCashout}
      total={total}
    />
  );
};

export default PaymentDialog;
