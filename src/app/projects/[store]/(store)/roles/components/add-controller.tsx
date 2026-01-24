"use client";
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import RoleFormDialog from "./roleFormDialog";

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
        color="secondary"
        size="small"
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
