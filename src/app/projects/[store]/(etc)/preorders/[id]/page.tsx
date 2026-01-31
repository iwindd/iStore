"use client";

import PreOrderStatusChip from "@/components/Chips/PreOrderStatusChip";
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useFormatter, useTranslations } from "next-intl";
import { Suspense } from "react";
import OrderSummarySkeleton from "./components/OrderSummarySkeleton";
import PreOrderItemsCard from "./components/PreOrderItemsDatatable";
import { usePreOrderOrder } from "./PreOrderOrderContext";

const PreOrderOrderDetailPage = () => {
  const t = useTranslations("PREORDERS.detail");
  const f = useFormatter();
  const { order } = usePreOrderOrder();

  return (
    <Suspense fallback={<OrderSummarySkeleton />}>
      <Stack spacing={3}>
        {/* Summary Cards */}
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("labels.total")}
              </Typography>
              <Typography variant="h5">
                {f.number(order.total, "currency")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("labels.cost")}
              </Typography>
              <Typography variant="h5">
                {f.number(order.cost, "currency")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("labels.profit")}
              </Typography>
              <Typography variant="h5">
                {f.number(order.profit, "currency")}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t("labels.items_count")}
              </Typography>
              <Typography variant="h5">{f.number(order.itemsCount)}</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Order Information */}
        <Card>
          <CardHeader title={t("order_info")} />
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" width={150}>
                  {t("labels.order_id")}:
                </Typography>
                <Typography variant="body1">#{order.id}</Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" width={150}>
                  {t("labels.created_at")}:
                </Typography>
                <Typography variant="body1">
                  {f.dateTime(order.created_at, "short")}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" width={150}>
                  {t("labels.creator")}:
                </Typography>
                <Typography variant="body1">
                  {order.creator
                    ? `${order.creator.user.first_name} ${order.creator.user.last_name}`
                    : "-"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" width={150}>
                  {t("labels.status")}:
                </Typography>
                <PreOrderStatusChip status={order.status} />
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" width={150}>
                  {t("labels.note")}:
                </Typography>
                <Typography variant="body1">{order.note}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Preorder Items */}
        <PreOrderItemsCard />
      </Stack>
    </Suspense>
  );
};

export default PreOrderOrderDetailPage;
