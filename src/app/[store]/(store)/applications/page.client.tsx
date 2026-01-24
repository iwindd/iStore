"use client";

import AddApplicationCard from "@/components/Cards/Application/AddApplicationCard";
import LineCardDisplay from "@/components/Cards/Application/LineCardDisplay";
import CreateApplicationModal from "@/components/dialog/CreateApplicationModal";
import { useDialog } from "@/hooks/use-dialog";
import App, { Wrapper } from "@/layouts/App";
import { AddTwoTone } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { LineApplication } from "@prisma/client";
import { useTranslations } from "next-intl";

type ApplicationClientPageProps = {
  applications: LineApplication[];
};

const ApplicationClientPage = ({
  applications,
}: ApplicationClientPageProps) => {
  const t = useTranslations("APPLICATIONS");
  const applicationDialog = useDialog();

  return (
    <Wrapper>
      <App.Header>
        <App.Header.Title>{t("title")}</App.Header.Title>
        <App.Header.Actions>
          <Button
            startIcon={<AddTwoTone />}
            variant="contained"
            size="small"
            color="secondary"
            onClick={applicationDialog.handleOpen}
          >
            {t("create_button")}
          </Button>
        </App.Header.Actions>
      </App.Header>
      <App.Main>
        <Grid container spacing={2}>
          {applications.map((app) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={app.id}>
              <LineCardDisplay application={app} />
            </Grid>
          ))}
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <AddApplicationCard onClick={applicationDialog.handleOpen} />
          </Grid>
        </Grid>
      </App.Main>

      <CreateApplicationModal
        isOpen={applicationDialog.open}
        handleClose={applicationDialog.handleClose}
      />
    </Wrapper>
  );
};

export default ApplicationClientPage;
