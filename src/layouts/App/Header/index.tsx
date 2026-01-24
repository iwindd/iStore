import { Stack, Typography } from "@mui/material";

const AppHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={3}>
        {children}
      </Stack>
    </Stack>
  );
};

const AppHeaderTitle = ({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
}) => {
  return (
    <Stack spacing={0} sx={{ flex: "1 1 auto" }}>
      <Typography variant="h4">{children}</Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

AppHeaderTitle.displayName = "AppHeader.Title";
AppHeader.Title = AppHeaderTitle;

const AppHeaderActions = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      direction={"row"}
      spacing={2}
    >
      {children}
    </Stack>
  );
};

AppHeaderActions.displayName = "AppHeader.Actions";
AppHeader.Actions = AppHeaderActions;

export default AppHeader;
