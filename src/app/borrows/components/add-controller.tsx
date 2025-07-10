"use client";
import React from "react";
import {
  Button,
} from "@mui/material";
import { AddTwoTone } from "@mui/icons-material";
import { useInterface } from "@/providers/InterfaceProvider";
import { useDialog } from "@/hooks/use-dialog";
import BorrowDialogForm from "./borrowDialogForm";
import { useAuth } from "@/hooks/use-auth";
import { BorrowPermissionEnum } from "@/enums/permission";

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
