"use client";
import App, { Wrapper } from "@/layouts/App";
import HistoryDatatable from "./components/datatable";

const HistoryPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ประวัติการซื้อขายสินค้า</App.Header.Title>
      </App.Header>
      <App.Main>
        <HistoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default HistoryPage;
