"use client";
import { NavbarItem } from "@/config/Navbar";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

function NavItemGroup(props: Readonly<NavbarItem>): React.JSX.Element {
  return (
    <ListItem
      sx={{
        alignItems: "center",
        borderRadius: 0.3,
        cursor: "pointer",
        display: "flex",
        flex: "0 0 auto",
        gap: 1,
        position: "relative",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "0.1s background ease",
        minHeight: "40px",
        margin: "0 0 6px 0",
        padding: "0 0",
      }}
    >
      <ListItemButton
        disableRipple
        disableTouchRipple
        sx={{
          background: "transparent",
          "&:hover": {
            background: "transparent",
          },
          padding: "0 5px",
        }}
      >
        <ListItemText
          primary={"P"}
          slotProps={{
            primary: {
              sx: {
                color: "var(--NavItem-color)",
                fontWeight: 500,
                lineHeight: "28px",
                fontSize: "0.875em",
              },
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default NavItemGroup;
