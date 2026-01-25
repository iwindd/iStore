"use client";

import {
  fetchProductSelector,
  ProductSelectorInstance,
  searchProductSelector,
} from "@/actions/product/selectorProduct";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import BaseSelector, { BaseSelectorProps } from "./BaseSelector";

type ProductSelectorProps = Omit<
  BaseSelectorProps<ProductSelectorInstance>,
  "canCreate"
>;

const ProductSelector = (props_: ProductSelectorProps) => {
  const t = useTranslations("COMPONENTS.product_selector");
  const params = useParams();
  const storeSlug = params.store as string;

  const props = {
    ...props_,
    label: props_.label || t("label"),
    placeholder: props_.placeholder || t("placeholder"),
    noOptionsText: props_.noOptionsText || t("empty"),
  };

  return (
    <BaseSelector<ProductSelectorInstance>
      id="product-selector"
      fetchItem={async (id) => {
        return await fetchProductSelector(storeSlug, id);
      }}
      searchItems={async (query) => {
        return await searchProductSelector(storeSlug, query);
      }}
      getItemLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getItemKey={(option) => option.id}
      renderCustomOption={(option) => (
        <div>
          <Typography variant="caption" color="text.secondary">
            {t("option", {
              quantity: option.stock?.quantity || 0,
              serial: option.serial,
            })}
          </Typography>
        </div>
      )}
      {...props}
    />
  );
};

export default ProductSelector;
