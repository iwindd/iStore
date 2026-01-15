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

const BestSelling = () => {
  const range = useAppSelector((state) => state.dashboard.range);

  const { data, isLoading } = useQuery({
    queryKey: ["top-selling-products", range],
    queryFn: () => getTopSellingProducts(range),
  });

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="สินค้าขายดี" />
      <CardContent>
        {isLoading ? (
          <List>
            {new Array(5).fill(0).map((_, index) => (
              <ListItem key={`skeleton-${index}`} disableGutters>
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
                ยังไม่มีข้อมูลการขายในระยะเวลานี้
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
                        {product.sold} ชิ้น
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ขายแล้ว
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
