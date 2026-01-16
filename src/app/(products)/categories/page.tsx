"use client";
import { useDialog } from "@/hooks/use-dialog";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import CategoryDatatable from "./components/datatable";

const CategoryPage = () => {
  const dialog = useDialog();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>หมวดหมู่สินค้า</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            onClick={dialog.handleOpen}
            size="small"
          >
            เพิ่มรายการ
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
