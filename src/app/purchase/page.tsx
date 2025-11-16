"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import PurchaseDatatable from "./components/datatable";

const PurchasePage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ซื้อสินค้า</App.Header.Title>
        <App.Header.Actions>
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <PurchaseDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default PurchasePage;
