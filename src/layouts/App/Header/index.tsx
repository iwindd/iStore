import { Stack, Typography } from "@mui/material";
import { JSX } from "react";

const AppHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack my={2}>
      <Stack direction="row" spacing={3}>
        {children}
      </Stack>
    </Stack>
  );
};

const AppHeaderTitle = ({
  children,
  subtitle,
  icon,
}: {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: JSX.Element;
}) => {
  return (
    <Stack spacing={0} sx={{ flex: "1 1 auto" }}>
      <Stack direction="row" alignItems={"center"} spacing={1}>
        {icon}
        <Typography variant="h5">{children}</Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
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
