"use client";

import GetLineBotConfig from "@/actions/lineBot/get";
import SaveLineBotConfig from "@/actions/lineBot/save";
import useFormValidate from "@/hooks/useFormValidate";
import { LineBotSchema, LineBotValues } from "@/schema/LineBot";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyTwoTone,
  LockTwoTone,
  PeopleTwoTone,
  Save,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

const LineBotPartial = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormValidate<LineBotValues>({
    resolver: zodResolver(LineBotSchema),
    defaultValues: {
      lineUserId: "",
      lineChannelAccessToken: "",
      lineChannelSecret: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await GetLineBotConfig();
        if (response.success && response.data) {
          setValue("lineUserId", response.data.lineUserId);
          setValue(
            "lineChannelAccessToken",
            response.data.lineChannelAccessToken
          );
          setValue("lineChannelSecret", response.data.lineChannelSecret);
        }
      } catch (error) {
        console.error("Failed to fetch Line Bot config", error);
        enqueueSnackbar("ไม่สามารถโหลดข้อมูลได้", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data: LineBotValues) => {
    setIsLoading(true);
    try {
      const response = await SaveLineBotConfig(data);
      if (response.success) {
        enqueueSnackbar("บันทึกข้อมูลเรียบร้อยแล้ว", { variant: "success" });
      } else {
        enqueueSnackbar("เกิดข้อผิดพลาดในการบันทึกข้อมูล", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Failed to save Line Bot config", error);
      enqueueSnackbar("เกิดข้อผิดพลาดในการบันทึกข้อมูล", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title="ไลน์บอทประชาสัมพันธ์" />
        <Divider />
        <CardContent>
          <Stack
            spacing={2}
            width={{
              xs: "100%",
              sm: "400px",
              md: "500px",
              lg: "600px",
            }}
          >
            <TextField
              label="Line User ID"
              type="password"
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
              {...register("lineUserId")}
            />
            <TextField
              label="Channel Access Token"
              type="password"
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
              {...register("lineChannelAccessToken")}
            />
            <TextField
              label="Channel Secret"
              type="password"
              disabled={isLoading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockTwoTone />
                    </InputAdornment>
                  ),
                },
              }}
              {...register("lineChannelSecret")}
            />
            <div>
              <Button
                variant="contained"
                startIcon={<Save />}
                type="submit"
                disabled={isLoading}
                color="success"
              >
                บันทึก
              </Button>
            </div>
          </Stack>
        </CardContent>
        <Divider />
      </Card>
    </>
  );
};

export default LineBotPartial;
