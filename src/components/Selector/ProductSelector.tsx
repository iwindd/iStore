"use client";
import findProductById from "@/actions/product/findById";
import SearchProducts, { SearchProduct } from "@/actions/product/search";
import { TextFieldProps, Typography } from "@mui/material";
import { useCallback } from "react";
import BaseSelector from "./BaseSelector";

interface SelectorProps {
  onSubmit(Product: SearchProduct | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
}

const ProductSelector = (props: SelectorProps) => {
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
    <BaseSelector
      id="product-selector"
      label="กรุณาเลือกสินค้า"
      placeholder="ค้นหาสินค้า (ชื่อ, รหัส, Keyword)"
      defaultValue={props.defaultValue}
      fieldProps={props.fieldProps}
      onSubmit={props.onSubmit}
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
    />
  );
};

export default ProductSelector;
