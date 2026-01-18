"use client";
import getProductDatatable from "@/actions/product/getProductDatatable";
import { useAppSelector } from "@/hooks";
import { Grid, Stack, Typography } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductGridSkeleton";

const ProductsTab = () => {
  const t = useTranslations("CASHIER.tabs.products");
  const searchQuery = useAppSelector((state) => state.cart.scanner);
  const filter = searchQuery.split(" ");

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cashier-products", filter],
    queryFn: async () =>
      await getProductDatatable(
        {
          pagination: {
            page: 0,
            pageSize: 12,
          },
          sort: [] as GridSortModel,
          filter: {
            quickFilterValues: filter,
            items: [],
          },
        },
        "all",
      ),
  });

  console.log(response);

  const products = response?.data || [];

  if (!isLoading && !error && products.length === 0) {
    return (
      <Typography color="text.secondary" align="center" py={4}>
        {t("empty")}
      </Typography>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Loading State */}
      {isLoading && <ProductGridSkeleton count={12} />}

      {/* Error State */}
      {error && (
        <Typography color="error" align="center">
          {searchQuery ? t("no_results") : t("empty")}
        </Typography>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <Grid container spacing={1}>
          {products.map((product) => (
            <Grid size={3} key={product.id}>
              <ProductCard
                key={product.id}
                id={product.id}
                serial={product.serial}
                label={product.label}
                price={product.price}
                stock={product.stock?.quantity || 0}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default ProductsTab;
