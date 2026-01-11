"use client";

import AppFooter from "@/layouts/App/Footer";
import {
  LineApplicationSchema,
  LineApplicationSchemaType,
} from "@/schema/Application";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowForwardTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

type FormLineApplicationProps = {
  onSubmit?: (data: LineApplicationSchemaType) => void;
};

const FormLineApplication = ({ onSubmit }: FormLineApplicationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LineApplicationSchemaType>({
    resolver: zodResolver(LineApplicationSchema),
    defaultValues: {
      useAsChatbot: false,
      useAsBroadcast: false,
    },
  });

  const handleFormSubmit = (data: LineApplicationSchemaType) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log("Form Data:", data);
    }
  };

  return (
    <Stack
      component={"form"}
      onSubmit={handleSubmit(handleFormSubmit)}
      spacing={1}
    >
      <Card>
        <CardHeader title="ข้อมูลทั่วไป" />
        <CardContent>
          <TextField
            {...register("name")}
            label="ชื่อแอพพลิเคชั่น"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="ข้อมูลแอพพลิเคชั่น" />
        <CardContent>
          <Stack spacing={1}>
            <TextField
              {...register("channelAccessToken")}
              label="Channel Access Token"
              fullWidth
              error={!!errors.channelAccessToken}
              helperText={errors.channelAccessToken?.message}
              disabled={isSubmitting}
            />
            <TextField
              {...register("channelSecret")}
              label="Channel Secret"
              fullWidth
              error={!!errors.channelSecret}
              helperText={errors.channelSecret?.message}
              disabled={isSubmitting}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="อื่นๆ" />
        <CardContent>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  {...register("useAsChatbot")}
                  defaultChecked={false}
                  disabled={isSubmitting}
                />
              }
              label="ใช้สำหรับ แชทบอท"
            />
            <FormControlLabel
              control={
                <Switch
                  {...register("useAsBroadcast")}
                  defaultChecked={false}
                  disabled={isSubmitting}
                />
              }
              label="ใช้สำหรับ ประชาสัมพันธ์"
            />
          </Stack>
        </CardContent>
      </Card>

      <AppFooter
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="subtitle1" color="secondary">
          จัดการแอพพลิเคชั่น
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardTwoTone />}
          type="submit"
          disabled={isSubmitting}
        >
          บันทึก
        </Button>
      </AppFooter>
    </Stack>
  );
};

export default FormLineApplication;
