"use client";
import { Stack, Tab, Tabs } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AllProductsDatatable from "./datatables/AllProductsDatatable";
import OrderPreOrderDatatable from "./datatables/OrderPreOrderDatatable";
import OrderProductDatatable from "./datatables/OrderProductDatatable";

interface HistoryTabsProps {
  orderId: number;
}

const HistoryTabs = ({ orderId }: HistoryTabsProps) => {
  const t = useTranslations("HISTORIES.detail.tabs");
  const [currentTab, setCurrentTab] = useState<"all" | "product" | "preorder">(
    "all",
  );

  return (
    <Stack>
      <Tabs
        value={currentTab}
        onChange={(e, v) => setCurrentTab(v)}
        sx={{
          my: 3,
        }}
      >
        <Tab value="all" label={t("all")} />
        <Tab value="product" label={t("product")} />
        <Tab value="preorder" label={t("preorder")} />
      </Tabs>
      <Stack>
        {currentTab === "all" && <AllProductsDatatable orderId={orderId} />}
        {currentTab === "product" && (
          <OrderProductDatatable orderId={orderId} />
        )}
        {currentTab === "preorder" && (
          <OrderPreOrderDatatable orderId={orderId} />
        )}
      </Stack>
    </Stack>
  );
};

export default HistoryTabs;
