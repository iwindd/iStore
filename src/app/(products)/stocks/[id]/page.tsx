import App, { Wrapper } from "@/layouts/App";
import AddController from "../components/add-controller";
import StockDatatable from "../components/datatable";
import ToolController from "../components/tool-controller";
import Footer from "./components/Footer";

const CreateStockPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>เพิ่มรายการสินค้า</App.Header.Title>
        <App.Header.Actions>
          <ToolController />
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <StockDatatable />
        <Footer />
      </App.Main>
    </Wrapper>
  );
};

export default CreateStockPage;
