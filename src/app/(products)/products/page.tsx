"use client";
import App, { Wrapper } from "@/layouts/App";
import { useTranslations } from "next-intl";
import AddController from "./components/add-controller";
import ProductDatatable from "./components/datatable";

const ProductPage = () => {
  const t = useTranslations("PRODUCTS");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <ProductDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default ProductPage;
