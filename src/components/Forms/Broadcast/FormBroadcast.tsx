import { generateAdMessage } from "@/actions/broadcast/generateMessage";
import {
  CreateBroadcastSchema,
  CreateBroadcastValues,
} from "@/schema/Broadcast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import ImageCard from "./Partials/ImageCard";
import PromotionSelectionCard from "./Partials/PromotionSelectionCard";
import SettingCard from "./Partials/Settings";

export interface FormBroadcastProps {
  broadcast?: {
    event_id: number;
    title: string;
    message: string;
    image_url: string;
    scheduled_at: Date;
  };
  isLoading?: boolean;
  disabled?: boolean;
  onSubmit: (data: CreateBroadcastValues) => void;
}

const FormBroadcast = ({
  broadcast,
  isLoading,
  disabled: propsDisabled,
  onSubmit,
}: FormBroadcastProps) => {
  const t = useTranslations("BROADCASTS.form");
  const form = useForm<CreateBroadcastValues>({
    resolver: zodResolver(CreateBroadcastSchema),
    defaultValues: {
      type: "SCHEDULED",
      event_id: broadcast?.event_id || 0,
      title: broadcast?.title || "",
      message: broadcast?.message || "",
      image_url: broadcast?.image_url || "",
      scheduled_at: broadcast?.scheduled_at || dayjs().add(1, "hour").toDate(),
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = form;

  const handleFormSubmit = async (data: CreateBroadcastValues) => {
    let finalImageUrl = data.image_url;

    onSubmit({ ...data, image_url: finalImageUrl });
  };

  const aiGeneratePromotionOfferInfo = useMutation({
    mutationFn: async (eventId: number) => {
      return await generateAdMessage(eventId);
    },
    onSuccess: (message) => {
      setValue("message", message);
    },
    onError: (error) => {
      console.log("error generating promotion offer info", error);
    },
  });

  const disabled = isLoading || propsDisabled;

  return (
    <Grid container columns={12} spacing={3}>
      <Grid size={8}>
        <Stack spacing={3}>
          <Stack
            spacing={2}
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            id="broadcast-form"
          >
            <PromotionSelectionCard form={form} disabled={disabled} />

            <Card>
              <CardHeader title={t("sections.promotion.title")} />
              <CardContent>
                <Stack spacing={3}>
                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <FormControl fullWidth error={!!errors.title}>
                        <TextField
                          label={t("sections.promotion.name")}
                          fullWidth
                          disabled={disabled}
                          error={!!errors.title}
                          helperText={errors.title?.message}
                          {...register("title")}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TextField
                    label={t("sections.promotion.message")}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={
                      disabled || aiGeneratePromotionOfferInfo.isPending
                    }
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    placeholder={t("sections.promotion.message_placeholder")}
                    {...register("message")}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
          <ImageCard form={form} disabled={disabled} />
        </Stack>
      </Grid>
      <Grid size={4}>
        <Stack spacing={3}>
          <SettingCard form={form} disabled={disabled} />
          <Card>
            <CardContent
              component={Stack}
              direction={"row"}
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle1" color="secondary">
                {t("footer.label")}
              </Typography>
              <Stack direction={"row"} spacing={1}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={disabled}
                  endIcon={<SendTwoTone />}
                  form="broadcast-form"
                >
                  {t("submit")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={t("sections.preview.title")} />
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  ...
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FormBroadcast;
