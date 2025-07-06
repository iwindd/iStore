"use client";
import { useInterface } from "@/providers/InterfaceProvider";
import { RoleSchema, RoleValues } from "@/schema/Role";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Role from "@/actions/roles";
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import TreeViewPermissionItems, { TreeViewPermissionDefaultItems } from "./permissionItems";

type AddRoleControllerProps = {
  role?: any;
};

const AddRoleController = ({ role }: AddRoleControllerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { setBackdrop, isBackdrop } = useInterface();
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoleValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      label: "",
      permissions: TreeViewPermissionDefaultItems,
    },
  });

  const permissions: string[] = watch("permissions") || [];
  const onPermission = (event: React.SyntheticEvent | null, ids: string[]) => setValue("permissions", ids);

  const submitRole: SubmitHandler<RoleValues> = async (payload: RoleValues) => {
    setBackdrop(true);
    try {
      const resp = await Role.create(payload);
      if (!resp.success) throw Error(resp.message);
      reset();
      await queryClient.refetchQueries({ queryKey: ["roles"], type: "active" });
      enqueueSnackbar("บันทึกตำแหน่งเรียบร้อยแล้ว!", { variant: "success" });
      onClose();
    } catch (error) {
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <>
      <Button startIcon={<AddTwoTone />} variant="contained" onClick={onOpen}>
        เพิ่มตำแหน่ง
      </Button>

      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit(submitRole),
        }}
      >
        <DialogTitle>{role ? "แก้ไขตำแหน่ง" : "เพิ่มตำแหน่ง"}</DialogTitle>
        <DialogContent>
          <Stack sx={{ mt: 2 }}>
            <Stack flexDirection={"column"} spacing={1}>
              <TextField
                type="text"
                fullWidth
                label="ชื่อตำแหน่ง"
                {...register("label")}
              />
              <Box sx={{ minHeight: 352, minWidth: 290 }}>
                <RichTreeView 
                  multiSelect 
                  checkboxSelection 
                  items={TreeViewPermissionItems} 
                  defaultSelectedItems={TreeViewPermissionDefaultItems}
                  selectedItems={permissions}
                  onSelectedItemsChange={onPermission}
                  selectionPropagation={{
                    descendants: true,
                    parents: true,
                  }}
                />
              </Box>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" type="button" onClick={onClose}>
            ปิด
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveTwoTone />}
            type="submit"
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddRoleController;
