"use client";
import App, { Wrapper } from "@/layouts/App";
import AddRoleController from "./components/add-controller";
import RoleDatatable from "./components/datatable";

const RolePage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ตำแหน่ง</App.Header.Title>
        <App.Header.Actions>
          <AddRoleController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <RoleDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default RolePage;
