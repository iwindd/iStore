"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { ProductLayoutValue } from "./layout";

type ProductContextType = {
  product: Omit<ProductLayoutValue, "keywords"> & {
    stock: NonNullable<ProductLayoutValue["stock"]>;
    keywords: string[];
  };
  updateProduct: (product: any) => void;
};

const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ProductLayoutValue;
}) => {
  const [product, setProduct] = useState<ProductContextType["product"]>({
    ...value,
    stock: value.stock || {
      quantity: 0,
      useAlert: false,
      alertCount: 0,
    },
  });

  const updateProduct = (
    product: Partial<Omit<ProductContextType["product"], "id" | "serial">>,
  ) => {
    setProduct((prev) => ({ ...prev, ...product }));
  };

  const ctxValue = useMemo(
    () => ({ product, updateProduct }),
    [product, updateProduct],
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
