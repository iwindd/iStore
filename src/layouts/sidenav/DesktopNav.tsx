import { NavbarItem } from "@/config/Navbar";
import { alpha, Box, useTheme } from "@mui/material";
import NavItems from "./components";
import NavLogo from "./components/NavLogo";

const DesktopNav = ({ items }: Readonly<{ items?: NavbarItem[] }>) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        "--SideNav-color": "var(--mui-palette-common-white)",
        "--SideNav-background": "var(--mui-palette-background-paper)",
        "--NavItem-color": alpha(theme.palette.secondary.light, 0.9),
        "--NavItem-hover-background": "rgba(0, 0, 0, 0.04)",
        "--NavItem-active-background": alpha(theme.palette.primary.main, 0.08),
        "--NavItem-hover-active-background": alpha(
          theme.palette.primary.main,
          0.2,
        ),
        "--NavItem-active-color": theme.palette.primary.dark,
        "--NavItem-icon-color": alpha(theme.palette.secondary.light, 0.9),
        "--NavItem-icon-active-color": theme.palette.primary.dark,
        "--NavItem-group-label-color": alpha(
          theme.palette.secondary.light,
          0.9,
        ),
        bgcolor: "var(--SideNav-background)",
        color: "var(--SideNav-color)",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        height: "100%",
        left: 0,
        maxWidth: "100%",
        position: "fixed",
        borderRight: "1px solid var(--mui-palette-divider)",
        scrollbarWidth: "none",
        top: 0,
        width: "var(--SideNav-width)",
        zIndex: "var(--SideNav-zIndex)",
      }}
    >
      <NavLogo />

      <Box
        component="nav"
        sx={{
          flex: "1 1 auto",
          px: "18px",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <NavItems items={items} />
      </Box>
    </Box>
  );
};

export default DesktopNav;
