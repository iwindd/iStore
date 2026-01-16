"use client";
import fetchMostSoldProducts from "@/actions/product/fetchMostSoldProducts";
import Loading from "@/components/loading";
import { useAppDispatch } from "@/hooks";
import { addProductToCartById } from "@/reducers/cartReducer";
import { AddTwoTone } from "@mui/icons-material";
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const MostSellerTab = () => {
  const t = useTranslations("CASHIER.tabs.most_seller");
  const dispatch = useAppDispatch();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mostSoldProducts"],
    queryFn: async () => await fetchMostSoldProducts(),
  });

  if (isLoading || !products) {
    return <Loading centered m={5} />;
  }

  if (error) {
    return <Typography>{t("load_error")}</Typography>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t("serial")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("stock")}</TableCell>
            <TableCell align="right">{t("manage")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="text.secondary" align="center">
                  {t("empty")}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => {
            return (
              <TableRow key={product.id}>
                <TableCell>{product.serial}</TableCell>
                <TableCell>
                  <Stack>
                    {product.label}
                    {product.category && (
                      <Typography variant="caption" color={"text.secondary"}>
                        {t("category")} {product.category.label}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    {product.stock?.quantity} {t("items_unit")}
                    {product.category?.overstock && (
                      <Typography variant="caption" color={"text.secondary"}>
                        {t("backorder_allowed")}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => dispatch(addProductToCartById(product.id))}
                  >
                    <AddTwoTone />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MostSellerTab;
