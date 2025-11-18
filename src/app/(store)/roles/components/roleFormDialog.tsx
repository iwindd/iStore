import * as RoleActions from "@/actions/roles";

import { PermissionEnum } from "@/enums/permission";
import { getRawPermissions } from "@/libs/permission";
import { useInterface } from "@/providers/InterfaceProvider";
import { RoleSchema, RoleValues } from "@/schema/Role";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { RichTreeView } from "@mui/x-tree-view";
import { Prisma } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React from "react";
import { useForm } from "react-hook-form";
import TreeViewPermissionItems, {
  treeViewPermissionAllIds,
  TreeViewPermissionDefaultItems,
} from "./config/permissionItems";

type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: { permissions: true };
}>;

interface RoleFormDialogProps {
  onClose: () => void;
  isOpen: boolean;
  role: RoleWithPermissions | null;
}

const RoleFormDialog = ({ isOpen, onClose, role }: RoleFormDialogProps) => {
  const { setBackdrop } = useInterface();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [isSuperAdmin, setIsSuperAdmin] = React.useState<boolean>(false);
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

  const onPermissionChange = (_: React.SyntheticEvent | null, ids: string[]) =>
    setValue("permissions", ids);

  React.useEffect(() => {
    if (role) {
      const permissions = role.permissions.map(
        (p) => p.name
      ) as PermissionEnum[];
      setValue("label", role.label);
      setIsSuperAdmin(role.is_super_admin || false);

      if (role.permissions) {
        const rawPermissions = getRawPermissions(permissions);
        const hasInTreeView = rawPermissions.filter((p) =>
          treeViewPermissionAllIds.includes(p)
        );

        setValue("permissions", hasInTreeView);
      } else {
        setValue("permissions", TreeViewPermissionDefaultItems);
      }
    }
  }, [role, setValue]);

  const onSubmit = async (payload: RoleValues) => {
    setBackdrop(true);
    try {
      const resp = await (!role
        ? RoleActions.create(payload)
        : RoleActions.update(payload, role.id));
      if (!resp.success) throw Error(resp.message);
      reset();
      await queryClient.refetchQueries({ queryKey: ["roles"], type: "active" });
      enqueueSnackbar("บันทึกตำแหน่งเรียบร้อยแล้ว!", { variant: "success" });
      onClose();
    } catch (error) {
      console.error("error", error);
      enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
        variant: "error",
      });
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
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
            {!isSuperAdmin ? (
              <FormControl
                component={Box}
                error={!!errors["permissions"]?.message}
                sx={{
                  minHeight: 352,
                  minWidth: 290,
                  "&:focus-within .rich-tree-view-custom": {
                    borderColor: (theme) =>
                      !!errors["permissions"]
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                  },
                  "&:focus-within .form-label-custom": {
                    color: (theme) =>
                      !!errors["permissions"]
                        ? theme.palette.error.main
                        : theme.palette.primary.main,
                  },
                }}
              >
                <FormLabel className="form-label-custom">
                  กำหนดสิทธิ์ในการเข้าถึง
                </FormLabel>
                <RichTreeView
                  multiSelect
                  checkboxSelection
                  items={TreeViewPermissionItems}
                  defaultSelectedItems={TreeViewPermissionDefaultItems}
                  selectedItems={watch("permissions") || []}
                  onSelectedItemsChange={onPermissionChange}
                  selectionPropagation={{
                    descendants: true,
                    parents: true,
                  }}
                  sx={(theme) => ({
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderRadius: 1,
                    borderColor: !!errors["permissions"]
                      ? theme.palette.error.main
                      : theme.palette.divider,
                    transition: "border-color 0.2s ease",
                  })}
                  className="rich-tree-view-custom"
                />
                <FormHelperText>
                  {errors["permissions"]?.message}
                </FormHelperText>
              </FormControl>
            ) : (
              <Typography variant="caption">
                ตำแหน่งนี้ไม่สามารถแก้ไขสิทธิ์ได้
                เนื่องจากเป็นตำแหน่งผู้ดูแลระบบ
              </Typography>
            )}
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
