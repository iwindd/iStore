import { Stack, StackProps } from "@mui/material";

const AppFooter = ({
  children,
  ...props
}: { children: React.ReactNode } & StackProps) => {
  return (
    <Stack
      spacing={1}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        pl: { lg: "var(--SideNav-width)" },
        borderTop: "1px solid var(--mui-palette-divider)",
      }}
    >
      <Stack direction="row" spacing={3} p={2} {...props}>
        {children}
      </Stack>
    </Stack>
  );
};

AppFooter.displayName = "AppFooter";

export default AppFooter;
