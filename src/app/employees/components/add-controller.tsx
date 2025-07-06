'use client';
import { useDialog } from "@/hooks/use-dialog";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import UserFormDialog from "./userFormDialog";

const AddController = () => {
  const dialog = useDialog();
  const { isBackdrop } = useInterface();

  return (
    <>
      <Button
        startIcon={<AddTwoTone />}
        variant="contained"
        onClick={dialog.handleOpen}
      >
        เพิ่มรายการ
      </Button>

      <UserFormDialog
        isOpen={dialog.open && !isBackdrop}
        onClose={dialog.handleClose}
        user={null}
      />
    </>
  );
};

export default AddController;
