"use client";
import {
  CategorySelectorInstance,
  createCategorySelector,
  fetchCategorySelector,
  searchCategorySelector,
} from "@/actions/category/selectorCategory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type CategorySelectorProps = BaseSelectorProps<CategorySelectorInstance>;

const CategorySelector = (props_: CategorySelectorProps) => {
  const queryClient = useQueryClient();
  const params = useParams<{ store: string }>();

  const props = {
    ...props_,
    label: props_.label || "เลือกประเภทสินค้า...",
    placeholder: props_.placeholder || "ค้นหาประเภทสินค้า",
    canCreate: props_.canCreate ?? true,
  };

  const handleFetchItem = async (id: number) => {
    return await fetchCategorySelector(params.store, id);
  };

  const handleSearchItems = async (query: string) => {
    return await searchCategorySelector(params.store, query);
  };

  const createMutation = useMutation({
    mutationFn: async (label: string) => {
      return await createCategorySelector(params.store, label);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return (
    <BaseSelector<CategorySelectorInstance>
      id="category-selector"
      noOptionsText="ไม่พบประเภทสินค้า"
      fetchItem={handleFetchItem}
      searchItems={handleSearchItems}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <>{option.id == props.defaultValue ? "(กำลังใช้งาน) " : ""}</>
      )}
      onCreate={createMutation.mutateAsync}
      {...props}
    />
  );
};

export default CategorySelector;
