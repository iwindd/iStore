"use client";
import App, { Wrapper } from "@/layouts/App";
import { useTranslations } from "next-intl";
import ConsignmentDatatable from "./components/ConsignmentDatatable";

const ConsignmentPage = () => {
  const t = useTranslations("CONSIGNMENTS");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <ConsignmentDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default ConsignmentPage;
