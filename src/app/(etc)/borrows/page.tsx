"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import BorrowDatatable from "./components/datatable";

const BorrowPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>เบิกสินค้า</App.Header.Title>
        <App.Header.Actions>
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <BorrowDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default BorrowPage;
