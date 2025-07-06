"use client";
import Permissions, { PermissionInstance } from "@/config/Permission";
import { PermissionEnum } from "@/enums/permission";
import { useInterface } from "@/providers/InterfaceProvider";
import { RoleSchema, RoleValues } from "@/schema/Role";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Role from "@/actions/roles"; 

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
    reset
  } = useForm<RoleValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      label: "",
      permissions: [],
    },
  });

  const permissions: string[] = watch("permissions") || [];
  const onPermission = (checked: boolean, Permissions: PermissionInstance[]) => {
    const current = watch("permissions") || [];
    const withoutChildren = current.filter(
      (p) => !Permissions.map((perm) => perm.name).includes(p as PermissionEnum)
    );
    const newPermissions = checked
      ? [...withoutChildren, ...Permissions.map((p) => p.name)]
      : withoutChildren;
    setValue("permissions", newPermissions);
  };

  const submitRole: SubmitHandler<RoleValues> = async (
    payload: RoleValues
  ) => {
    setBackdrop(true);
    try {
      const resp = await Role.create(payload);
      if (!resp.success) throw Error(resp.message);
      reset();
      await queryClient.refetchQueries({queryKey: ["roles"], type: "active"});
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
              {Permissions.filter((perm) => !perm.childOf).map((permission) => {
                const childrenPerms = Permissions.filter(
                  (child) => child.childOf === permission.name
                );
                return (
                  <div key={permission.name}>
                    <FormControlLabel
                      label={permission.label}
                      control={
                        <Checkbox
                          value={permission.name}
                          onChange={(e) =>
                            onPermission(e.target.checked, [
                              ...childrenPerms,
                              permission,
                            ])
                          }
                          indeterminate={
                            childrenPerms.some((child) =>
                              permissions.includes(child.name)
                            ) &&
                            childrenPerms.some(
                              (child) => !permissions.includes(child.name)
                            )
                          }
                          checked={
                            permissions.includes(permission.name) &&
                            childrenPerms.some((child) => permissions.includes(child.name))
                          }
                        />
                      }
                    />
                    {childrenPerms && childrenPerms.length > 0 && (
                      <FormGroup sx={{ ml: 2 }}>
                        {childrenPerms.map((child) => {
                          return (
                            <FormControlLabel
                              key={`${permission.name}-${child.name}`}
                              label={child.label}
                              control={
                                <Checkbox
                                  value={child.name}
                                  checked={permissions.includes(child.name)}
                                  onChange={(e) =>
                                    onPermission(e.target.checked, [child])
                                  }
                                />
                              }
                            />
                          );
                        })}
                      </FormGroup>
                    )}
                  </div>
                );
              })}
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
