import AnalysisCharts from "./components/Analysis";
import DashboardController from "./components/DashboardController";
import Stats from "./components/Stats";

const Dashboard = () => {
  return (
    <>
      <DashboardController />
      <Stats />
      <AnalysisCharts />
    </>
  );
};

export default Dashboard;
