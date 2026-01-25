import App, { Wrapper } from "@/layouts/App";
import { getTranslations } from "next-intl/server";
import HistoryDatatable from "./components/datatable";

const HistoryPage = async () => {
  const t = await getTranslations("HISTORIES");

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
      </App.Header>
      <App.Main>
        <HistoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default HistoryPage;
