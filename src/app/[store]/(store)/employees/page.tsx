"use client";
import App, { Wrapper } from "@/layouts/App";
import AddController from "./components/add-controller";
import EmployeeDatatable from "./components/datatable";

const EmployeePage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>พนักงาน</App.Header.Title>
        <App.Header.Actions>
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <EmployeeDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default EmployeePage;
