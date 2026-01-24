import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {useRouter} from "next/navigation";
import * as React from "react";

import {useAuth} from "@/hooks/use-auth";
import {clearProductCart} from "@/reducers/cartReducer";
import {getPath} from "@/router";
import {LogoutTwoTone, Settings} from "@mui/icons-material";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useSnackbar} from "notistack";
import {useDispatch} from "react-redux";

export interface StoreUserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

const StoreUserPopover = ({
  anchorEl,
  onClose,
  open,
}: Readonly<StoreUserPopoverProps>) => {
  const router = useRouter();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [, setStocks] = React.useState<any>([]);
  const dispatch = useDispatch();

  const onSignout = React.useCallback(async (): Promise<void> => {
    onClose();
    try {
      await signOut({ callbackUrl: "/", redirect: true });
      dispatch(clearProductCart());
      setStocks([]);
      router.refresh();
      enqueueSnackbar("ออกจากระบบสำเร็จ", { variant: "success" });
    } catch (err) {
      console.error(err);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    }
  }, [router, enqueueSnackbar, onClose, dispatch, setStocks]);

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
        <MenuItem component={Link} href={getPath("store.account")}>
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
};

export default StoreUserPopover;
