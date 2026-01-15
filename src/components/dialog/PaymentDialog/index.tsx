import CashoutContent from "./components/CashoutContent";

export interface PaymentDialogProps {
  open: boolean;
  onClose(): void;
}

const PaymentDialog = ({ open, onClose }: PaymentDialogProps) => {
  return <CashoutContent open={open} onClose={onClose} />;
};

export default PaymentDialog;
