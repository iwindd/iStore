"use client";
import { getTopSellingProducts } from "@/actions/dashboard/getTopSellingProducts";
import { useAppSelector } from "@/hooks";
import { money } from "@/libs/formatter";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const BestSelling = () => {
  const t = useTranslations("DASHBOARD.best_selling");
  const range = useAppSelector((state) => state.dashboard.range);
  const params = useParams<{ store: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["top-selling-products", params.store, range],
    queryFn: () => getTopSellingProducts(params.store, range),
  });

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title={t("title")} />
      <CardContent>
        {isLoading ? (
          <List>
            {new Array(5).fill(0).map(() => (
              <ListItem key={crypto.randomUUID()} disableGutters>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <List disablePadding>
            {data?.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                {t("empty")}
              </Typography>
            ) : (
              data?.map((product, index) => (
                <Stack key={product.id}>
                  <ListItem disableGutters>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {product.label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {money(product.price)}
                        </Typography>
                      }
                    />
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle2" color="primary.main">
                        {t("sold_count", { count: product.sold })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("sold_label")}
                      </Typography>
                    </Stack>
                  </ListItem>
                  {index < data.length - 1 && <Divider component="li" />}
                </Stack>
              ))
            )}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default BestSelling;
