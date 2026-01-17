import Logo from "@/components/core/logo";
import { getPath } from "@/router";
import { Box, Stack, StackProps } from "@mui/material";
import Link from "next/link";

const NavLogo = ({
  slotProps,
}: {
  slotProps?: {
    stack?: StackProps;
  };
}) => {
  return (
    <Stack
      spacing={1}
      sx={{
        p: 2,
        pt: 3,
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
              justifyContent: "start",
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default NavLogo;
