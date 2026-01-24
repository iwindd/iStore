"use client";
import App, { Wrapper } from "@/layouts/App";
import { useTranslations } from "next-intl";
import AddProductDialogTrigger from "./components/AddProductDialog";
import ProductDatatable from "./components/datatable";

const ProductPage = () => {
  const t = useTranslations("PRODUCTS");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <AddProductDialogTrigger />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <ProductDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default ProductPage;
