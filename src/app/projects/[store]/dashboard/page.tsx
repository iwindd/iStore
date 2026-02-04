import { Stack } from "@mui/material";
import AnalysisCharts from "./components/Analysis";
import DashboardController from "./components/DashboardController";
import Stats from "./components/Stats";

const Dashboard = () => {
  return (
    <Stack spacing={3}>
      <DashboardController />
      <Stats />
      <AnalysisCharts />
    </Stack>
  );
};

export default Dashboard;
