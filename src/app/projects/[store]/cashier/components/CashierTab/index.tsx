import { getRoute } from "@/router";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ProductsTab from "../../tabs/Products";
import RelatedPromotionOfferTab from "../../tabs/RelatedPromotionOffer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cashier-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const CashierTab = () => {
  const t = useTranslations("CASHIER.tabs");
  const [value, setValue] = useState(0);

  const CASHIER_TAB = [
    {
      name: "PRODUCTS",
      label: t("products.title"),
      component: ProductsTab,
      icon: getRoute("projects.store.products").icon,
    },
    {
      name: "RELATED_PROMOTION",
      label: t("related_promotion.title"),
      component: RelatedPromotionOfferTab,
      icon: getRoute("projects.store.promotions").icon,
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 3, mt: 2 }}>
        {CASHIER_TAB.map(({ icon: Icon, ...tab }, index) => (
          <Tab
            id={`cashier-tab-${index}`}
            key={tab.name}
            label={tab.label}
            icon={<Icon fontSize="small" />}
            iconPosition="start"
            sx={{
              py: 1,
              minHeight: "48px",
            }}
          />
        ))}
      </Tabs>

      {CASHIER_TAB.map((tab, index) => (
        <CustomTabPanel value={value} index={index} key={tab.name}>
          <tab.component />
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default CashierTab;
