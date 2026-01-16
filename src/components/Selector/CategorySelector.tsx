"use client";
import findCategory from "@/actions/category/find";
import SearchCategories, { SearchCategory } from "@/actions/category/search";
import upsertCategory from "@/actions/category/upsertCategory";
import { useQueryClient } from "@tanstack/react-query";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type CategorySelectorProps = BaseSelectorProps<SearchCategory>;

const CategorySelector = (props_: CategorySelectorProps) => {
  const queryClient = useQueryClient();
  const props = {
    ...props_,
    label: props_.label || "กรุณาเลือกประเภทสินค้า",
    placeholder: props_.placeholder || "ค้นหาประเภทสินค้า",
    canCreate: props_.canCreate ?? true,
  };

  return (
    <BaseSelector<SearchCategory>
      id="product-selector"
      noOptionsText="ไม่พบประเภทสินค้า"
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
      onCreate={async (label) => {
        const resp = await upsertCategory({
          label,
          active: false,
        });

        if (resp.success && resp.data) {
          queryClient.invalidateQueries({
            queryKey: ["categories"],
            type: "active",
          });

          return resp.data;
        }

        return null;
      }}
      {...props}
    />
  );
};

export default CategorySelector;
