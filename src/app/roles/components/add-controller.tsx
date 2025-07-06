"use client";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import RoleFormDialog from "@/app/categories/components/roleFormDialog";
import { useDialog } from "@/hooks/use-dialog";

type AddRoleControllerProps = {
  role?: any;
};

const AddRoleController = ({ role }: AddRoleControllerProps) => {
  const { isBackdrop } = useInterface();
  const dialog = useDialog();

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={dialog.handleOpen}
      >
        เพิ่มตำแหน่ง
      </Button>

      <RoleFormDialog
        isOpen={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
        role={null}
      />
    </>
  );
};

export default AddRoleController;
