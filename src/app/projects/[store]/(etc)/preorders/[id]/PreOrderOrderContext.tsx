"use client";
import { PreOrderOrderStatus } from "@/actions/preorder/getPreOrderOrderDetail";
import { createContext, useContext, useMemo } from "react";

type PreOrderOrderContextType = {
  order: {
    id: number;
    created_at: Date;
    total: number;
    cost: number;
    profit: number;
    note: string | null;
    itemsCount: number;
    status: PreOrderOrderStatus;
    creator: {
      user: {
        first_name: string;
        last_name: string;
      };
    } | null;
  };
};

const PreOrderOrderContext = createContext<PreOrderOrderContextType | null>(
  null,
);

export const PreOrderOrderProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: PreOrderOrderContextType["order"];
}) => {
  const valueMemo = useMemo(() => {
    return {
      order: value,
    };
  }, [value]);

  return (
    <PreOrderOrderContext.Provider value={valueMemo}>
      {children}
    </PreOrderOrderContext.Provider>
  );
};

export const usePreOrderOrder = () => {
  const ctx = useContext(PreOrderOrderContext);
  if (!ctx)
    throw new Error(
      "usePreOrderOrder must be used inside PreOrderOrderProvider",
    );
  return ctx;
};
