"use client";
import App, { Wrapper } from "@/layouts/App";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PreOrdersDatatable from "./components/datatable";
import PreOrderOrdersDatatable from "./components/PreOrderOrdersDatatable";

const PreOrders = () => {
  const t = useTranslations("PREORDERS");
  const [view, setView] = useState<"items" | "orders">("items");

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "items" | "orders" | null,
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title subtitle={t("description")}>
          {t("title")}
        </App.Header.Title>
        <App.Header.Actions>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            color="primary"
          >
            <ToggleButton value="items">{t("tabs.items")}</ToggleButton>
            <ToggleButton value="orders">{t("tabs.orders")}</ToggleButton>
          </ToggleButtonGroup>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        {view === "items" ? (
          <PreOrdersDatatable />
        ) : (
          <PreOrderOrdersDatatable />
        )}
      </App.Main>
    </Wrapper>
  );
};

export default PreOrders;
