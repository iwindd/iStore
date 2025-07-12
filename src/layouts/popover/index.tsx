import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { LogoutTwoTone, Settings } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { Path } from "@/config/Path";
import { useRecoilState } from "recoil";
import { CartState } from "@/atoms/cart";
import { StockState } from "@/atoms/stock";
import { useAuth } from "@/hooks/use-auth";

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [, setCart] = useRecoilState(CartState);
  const [, setStocks] = useRecoilState(StockState);

  const onSignout = React.useCallback(async (): Promise<void> => {
    onClose();
    try {
      await signOut({ callbackUrl: "/", redirect: true });
      setCart([]);
      setStocks([]);
      router.refresh();
      enqueueSnackbar("ออกจากระบบสำเร็จ", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    }
  }, [router, enqueueSnackbar, onClose, setCart, setStocks]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px" } } }}
    >
      <Box sx={{ p: "16px 20px " }}>
        <Typography variant="subtitle1">{user?.displayName}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        <MenuItem component={Link} href={Path("account").href}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          บัญชีของฉัน
        </MenuItem>
        <MenuItem onClick={onSignout}>
          <ListItemIcon>
            <LogoutTwoTone />
          </ListItemIcon>
          ออกจากระบบ
        </MenuItem>
      </MenuList>
    </Popover>
  );
}

export default UserPopover;