"use client";
import App, { Wrapper } from "@/layouts/App";
import OverstockDatatable from "./components/datatable";

const OverstockPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>สินค้าค้าง</App.Header.Title>
      </App.Header>
      <App.Main>
        <OverstockDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default OverstockPage;
