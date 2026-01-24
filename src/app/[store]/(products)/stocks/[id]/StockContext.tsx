"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { StockLayoutValue } from "./layout";

type StockContextType = {
  stock: StockLayoutValue;
  setStock: Dispatch<SetStateAction<StockLayoutValue>>;
};

const StockContext = createContext<StockContextType | null>(null);

export const StockProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: StockLayoutValue;
}) => {
  const [stock, setStock] = useState<StockLayoutValue>(value);

  const ctxValue = useMemo(() => ({ stock, setStock }), [stock, setStock]);

  return (
    <StockContext.Provider value={ctxValue}>{children}</StockContext.Provider>
  );
};

export const useStock = () => {
  const ctx = useContext(StockContext);
  if (!ctx) throw new Error("useStock must be used inside StockProvider");
  return ctx;
};
