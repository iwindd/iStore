import { EventSelectorItem } from "@/actions/broadcast/eventActions";
import { CreateBroadcastValues } from "@/schema/Broadcast";
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

export type SettingCardProps = {
  form: UseFormReturn<CreateBroadcastValues>;
  disabled?: boolean;
};

const SettingCard = ({
  form: {
    watch,
    formState: { errors },
    setValue,
    control,
  },
  disabled,
}: SettingCardProps) => {
  const [selectedEvent, setSelectedEvent] = useState<EventSelectorItem | null>(
    null
  );
  const selectedEventId = watch("event_id");
  const scheduledAt = watch("scheduled_at");
  const type = watch("type");

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
    <Card>
      <CardHeader title="การเผยแพร่" />
      <Divider />
      <CardContent>
        <Stack spacing={1}>
          <FormControl fullWidth>
            <InputLabel>รูปแบบการเผยแพร่</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} label="รูปแบบการเผยแพร่">
                  <MenuItem value="DRAFT">แบบร่าง (Draft)</MenuItem>
                  <MenuItem value="INSTANT">ส่งทันที (Instant)</MenuItem>
                  <MenuItem value="SCHEDULED">ตั้งเวลา (Scheduled)</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          {type !== "SCHEDULED" && (
            <Alert color="info">
              {type === "DRAFT"
                ? "บันทึกเป็นแบบร่าง จะยังไม่มีการส่ง Broadcast"
                : "ระบบจะส่ง Broadcast ทันทีหลังจากกดบันทึก"}
            </Alert>
          )}

          {type == "SCHEDULED" && (
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
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SettingCard;
