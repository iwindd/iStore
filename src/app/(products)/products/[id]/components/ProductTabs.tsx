"use client";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductTabsProps {
  productId: string;
}

const ProductTabs = ({ productId }: ProductTabsProps) => {
  const pathname = usePathname();

  // Determine active tab based on current path
  const isHistoryTab = pathname.includes("/history");
  const currentTab = isHistoryTab ? 1 : 0;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={currentTab}>
        <Tab
          label="ข้อมูลสินค้า"
          component={Link}
          href={`/products/${productId}`}
          sx={{ px: 2 }}
        />
        <Tab
          label="ประวัติการสั่งซื้อ"
          component={Link}
          href={`/products/${productId}/history`}
          sx={{ px: 2 }}
        />
      </Tabs>
    </Box>
  );
};

export default ProductTabs;
