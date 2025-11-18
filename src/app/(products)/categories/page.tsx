"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import CategoryDatatable from "./components/datatable";

const CategoryPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ประเภทสินค้า</App.Header.Title>
        <App.Header.Actions>
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <CategoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default CategoryPage;
