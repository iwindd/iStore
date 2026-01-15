import { useAppSelector } from "@/hooks";
import { CheckoutMode } from "@/reducers/cartReducer";
import CashoutContent from "./components/CashoutContent";
import ConsignmentContent from "./components/ConsignmentContent";

export interface PaymentDialogProps {
  open: boolean;
  onClose(): void;
}

const PaymentDialog = ({ open, onClose }: PaymentDialogProps) => {
  const checkoutMode = useAppSelector((state) => state.cart.checkoutMode);

  if (checkoutMode === CheckoutMode.CONSIGNMENT) {
    return <ConsignmentContent open={open} onClose={onClose} />;
  }

  return <CashoutContent open={open} onClose={onClose} />;
};

export default PaymentDialog;
