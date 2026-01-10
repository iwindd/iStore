"use client";
import { createContext, useContext } from "react";
import { ProductLayoutValue } from "./layout";

type ProductContextType = ProductLayoutValue;

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProductContextType;
}) => {
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
  return ctx;
};
