"use client";
import UpdateAddress from "@/actions/user/address";
import { Confirmation, useConfirm } from "@/hooks/use-confirm";
import { useInterface } from "@/providers/InterfaceProvider";
import { AddressSchema, AddressValues, FormatAddress } from "@/schema/Address";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const AddressForm = () => {
  const { setBackdrop } = useInterface();
  const { data: session, update } = useSession();
  const { register, handleSubmit } = useForm<AddressValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      address: session?.user.address?.address,
      district: session?.user.address?.district,
      area: session?.user.address?.area,
      province: session?.user.address?.province,
      postalcode: session?.user.address?.postalcode,
    },
  });

  const confirmation = useConfirm({
    title: "แจ้งเตือน",
    text: "คุณต้องการที่จะแก้ไขที่อยู่ร้านหรือไม่?",
    onConfirm: async (payload: AddressValues) => {
      if (!session) return;
      setBackdrop(false);
      try {
        const resp = await UpdateAddress(payload);
        if (!resp.success) throw Error(resp.message);
        update({
          ...session,
          user: {
            ...session.user,
            address: FormatAddress(resp.data),
          },
        });
        enqueueSnackbar("บันทึกที่อยู่ร้านสำเร็จแล้ว!", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้งภายหลัง", {
          variant: "error",
        });
      } finally {
        setBackdrop(false);
      }
    },
  });

  const onSubmit: SubmitHandler<AddressValues> = (payload) => {
    confirmation.with(payload);
    confirmation.handleOpen();
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="ที่อยู่"></CardHeader>
        <Divider />
        <CardContent>
          <Stack spacing={1}>
            <TextField
              label="ที่อยู่"
              placeholder="บ้านเลขที่/หมู่ที่/ซอย/ถนน"
              fullWidth
              autoFocus
              {...register("address")}
            />
            <TextField label="ตำบล" fullWidth {...register("district")} />
            <TextField label="อำเภอ" fullWidth {...register("area")} />
            <TextField label="จังหวัด" fullWidth {...register("province")} />
            <TextField
              label="รหัสไปรษณีย์"
              fullWidth
              {...register("postalcode")}
            />
          </Stack>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            type="submit"
            color="success"
            variant="contained"
            sx={{ ml: "auto" }}
            startIcon={<SaveTwoTone/>}
          >
            บันทึก
          </Button>
        </CardActions>
      </Card>
      <Confirmation {...confirmation.props} />
    </>
  );
};

export default AddressForm;
