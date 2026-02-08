import { Box } from "@mui/material";
import React from "react";

const NavbarContainer = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: "var(--mui-zIndex-appBar)",

        backdropFilter: scrolled ? "blur(20px)" : "none",
        backgroundColor: scrolled
          ? "rgba(var(--mui-palette-background-defaultChannel) / 0.2)"
          : "rgba(var(--mui-palette-background-defaultChannel) / 0)",

        transition: "background-color 100ms ease, backdrop-filter 100ms ease",
      }}
    >
      {children}
    </Box>
  );
};

export default NavbarContainer;
