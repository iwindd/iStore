"use client";
import { Card, CardContent, Divider, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import AllProductsDatatable from "./datatables/AllProductsDatatable";
import OrderPreOrderDatatable from "./datatables/OrderPreOrderDatatable";
import OrderProductDatatable from "./datatables/OrderProductDatatable";

interface HistoryTabsProps {
  orderId: number;
}

const HistoryTabs = ({ orderId }: HistoryTabsProps) => {
  const [currentTab, setCurrentTab] = useState<"all" | "product" | "preorder">(
    "all"
  );

  return (
    <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
        <Tab value="all" label="ทั้งหมด" sx={{ px: 2 }} />
        <Tab value="product" label="รายการสินค้า" sx={{ px: 2 }} />
        <Tab value="preorder" label="รายการพรีออเดอร์" sx={{ px: 2 }} />
      </Tabs>
      <Divider />
      <CardContent sx={{ px: 0 }}>
        {currentTab === "all" && <AllProductsDatatable orderId={orderId} />}
        {currentTab === "product" && (
          <OrderProductDatatable orderId={orderId} />
        )}
        {currentTab === "preorder" && (
          <OrderPreOrderDatatable orderId={orderId} />
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTabs;
