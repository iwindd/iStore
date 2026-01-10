import StockForm, { StockFormActions } from "@/components/Forms/Stock";
import App, { Wrapper } from "@/layouts/App";
import AppFooter from "@/layouts/App/Footer";
import AddController from "../components/add-controller";
import ToolController from "../components/tool-controller";

const CreateStockPage = () => {
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>สร้างรายการสต๊อก</App.Header.Title>
        <App.Header.Actions>
          <ToolController />
          <AddController />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <StockForm />
      </App.Main>
      <AppFooter
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <StockFormActions />
      </AppFooter>
    </Wrapper>
  );
};

export default CreateStockPage;
