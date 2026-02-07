"use client";
import { useAppDispatch } from "@/hooks";
import { money } from "@/libs/formatter";
import { addProductToCartBySerial } from "@/reducers/cartReducer";
import { AddTwoTone } from "@mui/icons-material";
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  id: number;
  serial: string;
  label: string;
  price: number;
  stock: number;
  usePreorder: boolean;
}

const ProductCard = ({
  id,
  serial,
  label,
  price,
  stock,
  usePreorder,
}: ProductCardProps) => {
  const t = useTranslations("CASHIER.tabs.products.card");
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addProductToCartBySerial(serial));
  };

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pb: 1,
        }}
      >
        {/* Product Info */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.5em",
            }}
          >
            {label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("serial", { serial })}
          </Typography>
        </Stack>

        {/* Price and Action */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mt: "auto" }}
        >
          <Typography variant="h6" color="primary" fontWeight={700}>
            {t("price", { price: money(price) })}
          </Typography>
          <IconButton
            color="secondary"
            onClick={handleAddToCart}
            size="small"
            disabled={stock === 0 && !usePreorder}
          >
            <AddTwoTone />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
