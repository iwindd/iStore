"use client";
import App, { Wrapper } from "@/layouts/App";
import { useTranslations } from "next-intl";
import PreOrdersDatatable from "./components/datatable";

const PreOrders = () => {
  const t = useTranslations("PREORDERS");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <PreOrdersDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default PreOrders;
