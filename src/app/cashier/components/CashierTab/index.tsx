import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import MostSellerTab from "../../tabs/MostSeller";
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
      name: "RELATED_PROMOTION",
      label: t("related_promotion.title"),
      component: RelatedPromotionOfferTab,
    },
    {
      name: "MOST_SELLER",
      label: t("most_seller.title"),
      component: MostSellerTab,
    },
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log({ newValue });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange}>
        {CASHIER_TAB.map((tab, index) => (
          <Tab
            id={`cashier-tab-${index}`}
            key={tab.name}
            label={tab.label}
            sx={{
              px: 2,
            }}
          />
        ))}
      </Tabs>

      {CASHIER_TAB.map((tab, index) => (
        <CustomTabPanel key={tab.name} value={value} index={index}>
          <tab.component />
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default CashierTab;
