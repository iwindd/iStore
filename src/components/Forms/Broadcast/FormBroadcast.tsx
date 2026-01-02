import { EventSelectorItem } from "@/actions/broadcast/eventActions";
import EventSelector from "@/components/EventSelector";
import useFormValidate from "@/hooks/useFormValidate";
import {
  CreateBroadcastSchema,
  CreateBroadcastValues,
} from "@/schema/Broadcast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveTwoTone } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useFormValidate<CreateBroadcastValues>({
    resolver: zodResolver(CreateBroadcastSchema),
    defaultValues: {
      event_id: broadcast?.event_id || 0,
      title: broadcast?.title || "",
      message: broadcast?.message || "",
      image_url: broadcast?.image_url || "",
      scheduled_at: broadcast?.scheduled_at || dayjs().add(1, "hour").toDate(),
    },
  });

  const selectedEventId = watch("event_id");
  const scheduledAt = watch("scheduled_at");

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

  const getMinDateTime = () => {
    if (selectedEvent) {
      const eventStart = dayjs(selectedEvent.start_at);
      const now = dayjs();
      return eventStart.isAfter(now) ? eventStart : now;
    }
    return dayjs();
  };

  const getMaxDateTime = () => {
    if (selectedEvent) {
      return dayjs(selectedEvent.end_at);
    }
    return undefined;
  };

  return (
    <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title="เลือกโปรโมชั่น" />
        <Divider />
        <CardContent>
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
          {selectedEvent && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {selectedEvent.note}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="ข้อมูล" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="หัวข้อประกาศ"
              fullWidth
              disabled={disabled}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />
            <TextField
              label="ข้อความประกาศ"
              fullWidth
              multiline
              rows={4}
              disabled={disabled}
              error={!!errors.message}
              helperText={errors.message?.message}
              {...register("message")}
            />
            <TextField
              label="URL รูปภาพ (ถ้ามี)"
              fullWidth
              disabled={disabled}
              error={!!errors.image_url}
              helperText={errors.image_url?.message}
              {...register("image_url")}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="ตั้งเวลา" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.scheduled_at}>
                <DateTimePicker
                  label="วันและเวลาที่จะส่ง"
                  value={dayjs(scheduledAt)}
                  onChange={(date) => {
                    if (date) {
                      setValue("scheduled_at", date.toDate());
                    }
                  }}
                  disabled={disabled || !selectedEventId}
                  minDateTime={getMinDateTime()}
                  maxDateTime={getMaxDateTime()}
                  format="DD/MM/YYYY HH:mm"
                  ampm={false}
                />
                {errors.scheduled_at && (
                  <FormHelperText>{errors.scheduled_at.message}</FormHelperText>
                )}
                {selectedEvent && (
                  <FormHelperText>
                    ต้องอยู่ในช่วง{" "}
                    {dayjs(selectedEvent.start_at).format("DD/MM/YYYY")} -{" "}
                    {dayjs(selectedEvent.end_at).format("DD/MM/YYYY")}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                startIcon={<SaveTwoTone />}
                disabled={disabled}
              >
                {broadcast ? "บันทึกการแก้ไข" : "สร้าง Broadcast"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

// Add React import for useState
import React from "react";

export default FormBroadcast;
