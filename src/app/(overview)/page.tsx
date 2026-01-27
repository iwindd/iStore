import App, { Wrapper } from "@/layouts/App";
import { Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import WelcomeCard from "./components/WelcomeCard";
import OverviewContent from "./content";

const AppOverviewPage = async () => {
  const t = await getTranslations("OVERVIEW");

  return (
    <Wrapper>
      <App.Header>
        <WelcomeCard />
      </App.Header>
      <App.Main>
        <Stack spacing={2} my={3}>
          <Typography variant="h5">{t("title")}</Typography>
        </Stack>
        <OverviewContent />
      </App.Main>
    </Wrapper>
  );
};

export default AppOverviewPage;
