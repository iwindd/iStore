"use client";
import { FormBuyXGetYProps } from "@/components/Forms/Promotions/FormBuyXGetY";
import { createContext, useContext } from "react";

const BuyXGetYContext = createContext<
  | (FormBuyXGetYProps["buyXgetY"] & {
      id: number;
      disabled_at: Date | null;
    })
  | null
>(null);

export const BuyXGetYProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) => {
  return (
    <BuyXGetYContext.Provider value={value}>
      {children}
    </BuyXGetYContext.Provider>
  );
};

export const useBuyXGetY = () => {
  const ctx = useContext(BuyXGetYContext);
  if (!ctx) throw new Error("useBuyXGetY must be used inside BuyXGetYContext");
  return ctx;
};
