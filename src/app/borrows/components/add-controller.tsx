"use client";
import { BorrowPermissionEnum } from "@/enums/permission";
import { useAuth } from "@/hooks/use-auth";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import BorrowDialogForm from "./borrowDialogForm";

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();
  const { user } = useAuth();

  if (!user?.hasPermission(BorrowPermissionEnum.CREATE)) return null;

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        size="small"
        onClick={dialog.handleOpen}
      >
        เพิ่มรายการ
      </Button>

      <BorrowDialogForm
        open={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
      />
    </>
  );
};

export default AddController;
