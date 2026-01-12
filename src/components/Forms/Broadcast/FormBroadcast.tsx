import { EventSelectorItem } from "@/actions/broadcast/eventActions";
import { generateAdMessage } from "@/actions/broadcast/generateMessage";
import EventSelector from "@/components/Selector/EventSelector";
import AppFooter from "@/layouts/App/Footer";
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
  Divider,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";
import ImageCard from "./Partials/ImageCard";
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
    watch,
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

  // Track selected event for date constraints
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventSelectorItem | null>(null);

  const disabled = isLoading || propsDisabled;

  const handleEventChange = (event: EventSelectorItem | null) => {
    if (event) {
      setValue("event_id", event.id);
      setSelectedEvent(event);
    } else {
      setValue("event_id", 0);
      setSelectedEvent(null);
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid size={8}>
        <Stack spacing={1}>
          <Stack
            spacing={2}
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            id="broadcast-form"
          >
            <Card>
              <CardHeader title="เลือกโปรโมชั่น" />
              <Divider />
              <CardContent>
                <Stack spacing={1}>
                  <Grid container spacing={1}>
                    <Grid size={6}>
                      <FormControl fullWidth error={!!errors.event_id}>
                        <EventSelector
                          onSubmit={handleEventChange}
                          defaultValue={broadcast?.event_id}
                          error={!!errors.event_id}
                          helperText={errors.event_id?.message}
                          fieldProps={{
                            disabled,
                          }}
                        />
                      </FormControl>
                      {selectedEvent?.note && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {selectedEvent.note}
                        </Typography>
                      )}
                    </Grid>
                    <Grid size={6}>
                      <FormControl fullWidth error={!!errors.event_id}>
                        <TextField
                          label="ชื่อประกาศ"
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
                    label="ข้อความประกาศ"
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
                    placeholder="เขียนข้อความประกาศ..."
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
        <Stack spacing={1}>
          <SettingCard form={form} disabled={disabled} />
          <Card>
            <CardHeader title="ตัวอย่าง" />
            <Divider />
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

      <AppFooter justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="subtitle1" color="secondary">
          จัดการสต๊อก
        </Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            type="submit"
            disabled={disabled}
            endIcon={<SendTwoTone />}
            form="broadcast-form"
          >
            เผยแพร่
          </Button>
        </Stack>
      </AppFooter>
    </Grid>
  );
};

export default FormBroadcast;
