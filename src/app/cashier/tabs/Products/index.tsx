"use client";
import GetProducts from "@/actions/product/get";
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

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cashier-products", searchQuery],
    queryFn: async () =>
      await GetProducts({
        pagination: {
          page: 0,
          pageSize: 16,
        },
        sort: [] as GridSortModel,
        filter: {
          items: [
            {
              field: "serial",
              operator: "contains",
              value: searchQuery,
            },
            {
              field: "label",
              operator: "contains",
              value: searchQuery,
            },
          ],
        },
      }),
  });

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
      {isLoading && <ProductGridSkeleton count={16} />}

      {/* Error State */}
      {error && (
        <Typography color="error" align="center">
          {searchQuery ? t("no_results") : t("empty")}
        </Typography>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <Grid container spacing={1}>
          {products.map(
            (product: {
              id: number;
              serial: string;
              label: string;
              price: number;
              stock: {
                quantity: number;
              };
            }) => (
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
            ),
          )}
        </Grid>
      )}
    </Stack>
  );
};

export default ProductsTab;
