"use client";

import { StockPermissionEnum } from "@/enums/permission";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/use-auth";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useDialog } from "@/hooks/use-dialog";
import { resetStock } from "@/reducers/stockReducer";
import { DeleteTwoTone, SaveTwoTone } from "@mui/icons-material";
import { Button, Card, CardHeader, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import CommitDialog from "../../components/CommitDialog";

const Footer = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const commitDialog = useDialog();

  const permissions = {
    canCreateStock: user?.hasPermission(StockPermissionEnum.CREATE),
    canUpdateStock: user?.hasPermission(StockPermissionEnum.UPDATE),
  };

  const clearConfirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการล้างรายการสต๊อกหรือไม่?",
    confirmProps: {
      color: "warning",
      startIcon: <DeleteTwoTone />,
    },
    confirm: "ล้างสต๊อก",
    onConfirm: async () => {
      dispatch(resetStock());
      enqueueSnackbar(`ล้างสต๊อกแล้ว!`, {
        variant: "success",
      });
    },
  });

  return (
    <Card>
      <CardHeader
        title="จัดการรายการ"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              onClick={clearConfirmation.handleOpen}
              color="inherit"
              variant="text"
              sx={{ ml: "auto" }}
            >
              ล้าง
            </Button>
            {permissions.canCreateStock && (
              <Button
                color="warning"
                endIcon={<SaveTwoTone />}
                onClick={commitDialog.handleOpen}
                sx={{ ml: "auto" }}
                variant="contained"
              >
                จัดการสต๊อก
              </Button>
            )}

            <CommitDialog
              open={commitDialog.open}
              onClose={commitDialog.handleClose}
            />
            <Confirmation {...clearConfirmation.props} />
          </Stack>
        }
      />
    </Card>
  );
};

export default Footer;
