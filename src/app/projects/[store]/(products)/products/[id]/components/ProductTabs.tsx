"use client";
import { useRoute } from "@/hooks/use-route";
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
  const route = useRoute();
  // Determine active tab based on current path
  let currentTab = 0;
  if (pathname.includes("/history")) {
    currentTab = 2;
  } else if (pathname.includes("/stock")) {
    currentTab = 1;
  }

  return (
    <Box>
      <Tabs value={currentTab}>
        <Tab
          label={t("information")}
          component={Link}
          href={route.path("projects.store.products.product", {
            id: productId,
          })}
        />
        <Tab
          label={t("stock")}
          component={Link}
          href={route.path("projects.store.products.product.stock", {
            id: productId,
          })}
        />
        <Tab
          label={t("history")}
          component={Link}
          href={route.path("projects.store.products.product.history", {
            id: productId,
          })}
        />
      </Tabs>
    </Box>
  );
};

export default ProductTabs;
