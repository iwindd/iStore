"use client";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductTabsProps {
  productId: string;
}

const ProductTabs = ({ productId }: ProductTabsProps) => {
  const t = useTranslations("PRODUCT_DETAIL.tabs");
  const pathname = usePathname();

  // Determine active tab based on current path
  let currentTab = 0;
  if (pathname.includes("/history")) {
    currentTab = 2;
  } else if (pathname.includes("/stock")) {
    currentTab = 1;
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={currentTab}>
        <Tab
          label={t("information")}
          component={Link}
          href={`/products/${productId}`}
          sx={{ px: 2 }}
        />
        <Tab
          label={t("stock")}
          component={Link}
          href={`/products/${productId}/stock`}
          sx={{ px: 2 }}
        />
        <Tab
          label={t("history")}
          component={Link}
          href={`/products/${productId}/history`}
          sx={{ px: 2 }}
        />
      </Tabs>
    </Box>
  );
};

export default ProductTabs;
