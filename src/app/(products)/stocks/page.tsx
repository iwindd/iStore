"use client";
import App, { Wrapper } from "@/layouts/App";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import HistoryDatatable from "./components/histories";

const StockPage = () => {
  const t = useTranslations("STOCKS");
  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Link href="/stocks/create" passHref>
            <Button startIcon={<Add />} variant="contained" size="small">
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
