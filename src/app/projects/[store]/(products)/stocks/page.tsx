"use client";
import { useRoute } from "@/hooks/use-route";
import App, { Wrapper } from "@/layouts/App";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import HistoryDatatable from "./components/histories";

const StockPage = () => {
  const t = useTranslations("STOCKS");
  const route = useRoute();
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Link href={route.path("projects.store.stocks.create")}>
            <Button
              startIcon={<Add />}
              variant="contained"
              color="secondary"
              size="small"
            >
              {t("add_button")}
            </Button>
          </Link>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <HistoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default StockPage;
