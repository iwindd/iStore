"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import StockDatatable from "./components/datatable";
import HistoryDatatable from "./components/histories";
import ToolController from "./components/tool-controller";

const StockPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>สต๊อก</App.Header.Title>
        <App.Header.Actions>
          <ToolController />
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <StockDatatable />
        <HistoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default StockPage;
