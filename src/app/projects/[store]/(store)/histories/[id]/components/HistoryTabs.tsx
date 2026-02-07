"use client";
import { Stack, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AllProductsDatatable from "./datatables/AllProductsDatatable";
import OrderPreOrderDatatable from "./datatables/OrderPreOrderDatatable";
import OrderProductDatatable from "./datatables/OrderProductDatatable";

import PromotionDatatable from "./datatables/PromotionDatatable";

interface HistoryTabsProps {
  orderId: number;
}

const HistoryTabs = ({ orderId }: HistoryTabsProps) => {
  const t = useTranslations("HISTORIES.detail.tabs");
  const [currentTab, setCurrentTab] = useState<
    "all" | "product" | "preorder" | "promotion"
  >("all");

  return (
    <Stack>
      <Tabs
        value={currentTab}
        onChange={(e, v) => setCurrentTab(v)}
        sx={{
          mt: 1,
          mb: 2,
        }}
      >
        <Tab value="all" label={t("all")} />
        <Tab value="product" label={t("product")} />
        <Tab value="preorder" label={t("preorder")} />
        <Tab value="promotion" label={t("promotion")} />
      </Tabs>
      <Stack>
        {currentTab === "all" && <AllProductsDatatable orderId={orderId} />}
        {currentTab === "product" && (
          <OrderProductDatatable orderId={orderId} />
        )}
        {currentTab === "preorder" && (
          <OrderPreOrderDatatable orderId={orderId} />
        )}
        {currentTab === "promotion" && <PromotionDatatable orderId={orderId} />}
      </Stack>
    </Stack>
  );
};

export default HistoryTabs;
