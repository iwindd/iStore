import { getUser } from "@/libs/session";
import { Stack } from "@mui/material";
import { notFound } from "next/navigation";
import DashboardController from "./components/DashboardController";
import Orders from "./components/Orders";
import Statistics from "./components/Statistics";
import Stats from "./components/Stats";

const Dashboard = async () => {
  const user = await getUser();
  if (!user) return notFound();

  return (
    <Stack spacing={1}>
      <DashboardController />
      <Stats />
      <Statistics />
      <Orders />
    </Stack>
  );
};

export default Dashboard;
