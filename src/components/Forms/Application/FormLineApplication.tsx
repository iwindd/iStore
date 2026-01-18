"use client";

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
import { LineApplication } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

type FormLineApplicationProps = {
  onSubmit?: (
    data: LineApplicationSchemaType,
  ) => void | Promise<boolean | void>;
  application?: LineApplication;
};

const FormLineApplication = ({
  onSubmit,
  application,
}: FormLineApplicationProps) => {
  const t = useTranslations("APPLICATIONS.form");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    getValues,
  } = useForm<LineApplicationSchemaType>({
    resolver: zodResolver(LineApplicationSchema),
    defaultValues: {
      useAsChatbot: application?.useAsChatbot || false,
      useAsBroadcast: application?.useAsBroadcast || false,
      name: application?.name || "",
      channelAccessToken: application?.channelAccessToken || "",
      channelSecret: application?.channelSecret || "",
    },
  });

  const handleFormSubmit = (data: LineApplicationSchemaType) => {
    if (onSubmit) {
      const result = onSubmit(data);
      if (result) reset(getValues(), { keepValues: true });
    } else {
      console.log("Form Data:", data);
    }
  };

  return (
    <Stack
      component={"form"}
      onSubmit={handleSubmit(handleFormSubmit)}
      spacing={2}
    >
      <Card>
        <CardHeader title={t("general_title")} />
        <CardContent>
          <TextField
            {...register("name")}
            label={t("name_label")}
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title={t("app_data_title")} />
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
        <CardHeader title={t("others_title")} />
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
              label={t("use_chatbot")}
            />
            <FormControlLabel
              control={
                <Switch
                  {...register("useAsBroadcast")}
                  defaultChecked={false}
                  disabled={isSubmitting}
                />
              }
              label={t("use_broadcast")}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent
          component={Stack}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="subtitle1" color="secondary">
            {t("footer_label")}
          </Typography>
          <Button
            variant="contained"
            endIcon={<ArrowForwardTwoTone />}
            type="submit"
            disabled={isSubmitting}
          >
            {t("save_button")}
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FormLineApplication;
