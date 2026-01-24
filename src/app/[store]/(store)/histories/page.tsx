"use client";
import App, { Wrapper } from "@/layouts/App";
import { useTranslations } from "next-intl";
import HistoryDatatable from "./components/datatable";

const HistoryPage = () => {
  const t = useTranslations("HISTORIES");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <HistoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default HistoryPage;
