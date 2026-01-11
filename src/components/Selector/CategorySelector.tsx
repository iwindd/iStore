"use client";
import CreateCategory from "@/actions/category/create";
import findCategory from "@/actions/category/find";
import SearchCategories, { SearchCategory } from "@/actions/category/search";
import { TextFieldProps } from "@mui/material";
import BaseSelector from "./BaseSelector";

interface SelectorProps {
  onSubmit(Product: SearchCategory | null): void;
  fieldProps?: TextFieldProps;
  defaultValue?: number;
}

const CategorySelector = (props: SelectorProps) => {
  return (
    <BaseSelector<SearchCategory>
      id="product-selector"
      label="กรุณาเลือกประเภทสินค้า"
      placeholder="ค้นหาประเภทสินค้า"
      noOptionsText="ไม่พบประเภทสินค้า"
      defaultValue={props.defaultValue}
      fieldProps={props.fieldProps}
      onSubmit={props.onSubmit}
      fetchItem={async (id) => {
        const resp = await findCategory(id);
        return resp.success && resp.data ? resp.data : null;
      }}
      searchItems={async (query) => {
        const resp = await SearchCategories(query);
        return resp.data || [];
      }}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>
          {option.id == props.defaultValue ? "(กำลังใช้งาน) " : ""}
          {option.overstock ? "อณุญาตการค้าง" : "ไม่อณุญาตการค้าง"}
        </>
      )}
      canCreate
      onCreate={async (label) => {
        const resp = await CreateCategory({
          label,
          active: true,
          overstock: false,
        });
        if (resp.success && resp.data) {
          return resp.data;
        }
        return null;
      }}
    />
  );
};

export default CategorySelector;
