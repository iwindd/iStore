"use client";
import PaymentDialog from "@/components/dialog/PaymentDialog";
import { OPEN_CASHOUT_DIALOG_KEYS } from "@/config/Cashout";
import React, { useEffect } from "react";
import { useAppSelector } from ".";

interface PaymentHook {
  isOpen: boolean;
  dialog: React.ReactNode;
  toggle(): void;
}

const usePayment = (): PaymentHook => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const cart = useAppSelector((state) => state.cart.products);

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggle = React.useCallback(() => {
    if (cart.length <= 0) return;

    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen, cart]);

  const onKeydown = React.useCallback(
    (key: KeyboardEvent) => {
      const action = () => {
        if (OPEN_CASHOUT_DIALOG_KEYS.includes(key.code) && !isOpen)
          return toggle();
        return null;
      };

      const state = action();
      if (state) key.preventDefault();
    },
    [toggle, isOpen]
  );

  useEffect(() => {
    const handleKeydown = (event: Event) =>
      onKeydown(event as unknown as KeyboardEvent);

    document.addEventListener("keydown", handleKeydown, false);

    return () => {
      document.removeEventListener("keydown", handleKeydown, false);
    };
  }, [onKeydown]);

  return {
    isOpen: isOpen,
    dialog: <PaymentDialog open={isOpen} onClose={onClose} />,
    toggle: () => setIsOpen((prev) => !prev),
  };
};

export default usePayment;
