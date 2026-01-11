"use client";
import findProductById from "@/actions/product/findById";
import SearchProducts, { SearchProduct } from "@/actions/product/search";
import { Typography } from "@mui/material";
import { useCallback } from "react";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type ProductSelectorProps = Omit<BaseSelectorProps<SearchProduct>, "canCreate">;

const ProductSelector = (props_: ProductSelectorProps) => {
  const props = {
    ...props_,
    label: props_.label || "กรุณาเลือกสินค้า",
    placeholder: props_.placeholder || "ค้นหาสินค้า",
  };

  const fetchItem = useCallback(async (id: number) => {
    const resp = await findProductById(id);
    if (resp.success && resp.data) {
      // Map to SearchProduct type
      return {
        id: resp.data.id,
        serial: resp.data.serial,
        label: resp.data.label,
        stock: resp.data.stock,
      };
    }
    return null;
  }, []);

  const searchItems = useCallback(async (query: string) => {
    const resp = await SearchProducts(query);
    return resp.data || [];
  }, []);

  return (
    <BaseSelector<SearchProduct>
      id="product-selector"
      noOptionsText="ไม่พบสินค้า"
      fetchItem={fetchItem}
      searchItems={searchItems}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <div>
          <Typography variant="caption" color="text.secondary">
            จำนวน: {option.stock} | รหัส: {option.serial}
          </Typography>
        </div>
      )}
      {...props}
    />
  );
};

export default ProductSelector;
