"use client";
import App, { Wrapper } from "@/layouts/App";
import ConsignmentDatatable from "./components/ConsignmentDatatable";

const ConsignmentPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>ฝากขาย</App.Header.Title>
      </App.Header>
      <App.Main>
        <ConsignmentDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default ConsignmentPage;
