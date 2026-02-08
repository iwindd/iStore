import Logo from "@/components/core/logo";
import { getPath } from "@/router";
import { Box, Stack, StackProps } from "@mui/material";
import Link from "next/link";

interface SidebarLogoProps {
  isCollapsed?: boolean;
  slotProps?: {
    stack?: StackProps;
  };
}

const SidebarLogo = ({ isCollapsed = false, slotProps }: SidebarLogoProps) => {
  return (
    <Stack
      spacing={1}
      sx={{
        p: isCollapsed ? 1 : 2,
        pt: isCollapsed ? 2 : 3,
        px: isCollapsed ? "8px" : "18px",
        transition: "padding 0.3s ease",
        alignItems: isCollapsed ? "center" : "flex-start",
      }}
      {...slotProps?.stack}
    >
      <Box
        component={Link}
        href={getPath("overview")}
        sx={{
          display: "inline-flex",
          textDecoration: "none",
        }}
      >
        <Logo
          width={32}
          height={32}
          slotProps={{
            stack: {
              justifyContent: isCollapsed ? "center" : "start",
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default SidebarLogo;
