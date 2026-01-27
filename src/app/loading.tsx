import GradientCircularProgress from "@/components/Loading/GradientCircularProgress";
import { Stack } from "@mui/material";

const LoadingPage = () => {
  return (
    <Stack pt={10} alignItems={"center"}>
      <GradientCircularProgress />
    </Stack>
  );
};

export default LoadingPage;
