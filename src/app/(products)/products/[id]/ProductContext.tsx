"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { ProductLayoutValue } from "./layout";

type ProductContextType = {
  product: ProductLayoutValue;
  updateStock: (stock: number) => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProductLayoutValue;
}) => {
  const [product, setProduct] = useState<ProductLayoutValue>(value);

  const updateStock = (stock: number) => {
    setProduct({ ...product, stock: { quantity: stock } });
  };

  const ctxValue = useMemo(
    () => ({ product, updateStock }),
    [product, updateStock]
  );

  return (
    <ProductContext.Provider value={ctxValue}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
  return ctx;
};
