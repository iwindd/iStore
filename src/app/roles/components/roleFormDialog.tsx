import TreeViewPermissionItems, { TreeViewPermissionDefaultItems } from "@/app/roles/components/config/permissionItems";
import { useInterface } from "@/providers/InterfaceProvider";
import { RoleSchema, RoleValues } from "@/schema/Role";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
} from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view";
import { Role } from "@prisma/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as RoleActions from "@/actions/roles";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { SaveTwoTone } from "@mui/icons-material";
import { getPermissionsWithGroups, maskToPermissions} from "@/libs/permission";

interface RoleFormDialogProps {
  onClose: () => void;
  isOpen: boolean;
  role: Role | null;
}

const RoleFormDialog = ({ isOpen, onClose, role }: RoleFormDialogProps) => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
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
  const onPermission = (event: React.SyntheticEvent | null, ids: string[]) =>
    setValue("permissions", ids);

  const submitRole: SubmitHandler<RoleValues> = async (payload: RoleValues) => {
    setBackdrop(true);
    try {
      const resp = await (!role ? RoleActions.create(payload) : RoleActions.update(payload, (role as Role).id));
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

  React.useEffect(() => {
    if (role){
      setValue("label", role.label);
      if (role.permission){
        const permissions = maskToPermissions(BigInt(role.permission));
        setValue("permissions", getPermissionsWithGroups(permissions))
      };
    } 
  }, [role, setValue]);

  return (
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
              error={!!errors["label"]?.message}
              helperText={errors["label"]?.message}
              {...register("label")}
            />
            <FormControl 
              component={Box}  
              error={!!errors["permissions"]?.message}
              sx={{
                minHeight: 352,
                minWidth: 290,
                '&:focus-within .rich-tree-view-custom': {
                  borderColor: (theme) =>
                    !!errors["permissions"]
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                },
                '&:focus-within .form-label-custom': {
                  color: (theme) =>
                    !!errors["permissions"]
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                },
              }}
            >
              <FormLabel className="form-label-custom">กำหนดสิทธิ์ในการเข้าถึง</FormLabel>
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
                sx={(theme) => ({
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 1,
                  borderColor: !!errors["permissions"]
                    ? theme.palette.error.main
                    : theme.palette.divider,
                  transition: 'border-color 0.2s ease',
                })}
                className="rich-tree-view-custom"
              />
              <FormHelperText>
                {errors["permissions"]?.message }
              </FormHelperText>
            </FormControl>
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
  );
};

export default RoleFormDialog;
