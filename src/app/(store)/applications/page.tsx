"use client";
import CreateApplicationModal from "@/components/dialog/CreateApplicationModal";
import { useDialog } from "@/hooks/use-dialog";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";

const ApplicationPage = () => {
  const applicationDialog = useDialog();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>แอพพลิเคชั่น</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
            onClick={applicationDialog.handleOpen}
          >
            สร้างแอพพลิเคชั่น
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>...</App.Main>

      <CreateApplicationModal
        isOpen={applicationDialog.open}
        handleClose={applicationDialog.handleClose}
      />
    </Wrapper>
  );
};

export default ApplicationPage;
