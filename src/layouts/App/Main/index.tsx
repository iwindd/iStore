import { Box } from "@mui/material";

const AppMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        pb: { lg: "var(--Footer-height)" },
      }}
    >
      {children}
    </Box>
  );
};

export default AppMain;
