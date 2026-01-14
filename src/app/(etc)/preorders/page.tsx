"use client";
import App, { Wrapper } from "@/layouts/App";
import PreOrdersDatatable from "./components/datatable";

const PreOrders = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>รายการพรีออเดอร์</App.Header.Title>
      </App.Header>
      <App.Main>
        <PreOrdersDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default PreOrders;
