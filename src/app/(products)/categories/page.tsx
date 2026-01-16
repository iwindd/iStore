"use client";
import { useDialog } from "@/hooks/use-dialog";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import CategoryDatatable from "./components/datatable";

const CategoryPage = () => {
  const t = useTranslations("CATEGORIES");
  const dialog = useDialog();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            onClick={dialog.handleOpen}
            size="small"
          >
            {t("add_button")}
          </Button>

          <CategoryFormDialog open={dialog.open} onClose={dialog.handleClose} />
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <CategoryDatatable />
      </App.Main>
    </Wrapper>
  );
};

export default CategoryPage;
