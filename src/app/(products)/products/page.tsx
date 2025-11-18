"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import ProductDatatable from "./components/datatable";

const ProductPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>สินค้า</App.Header.Title>
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
