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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("BROADCASTS.form.sections.settings");
  const [selectedEvent] = useState<EventSelectorItem | null>(null);
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
      <CardHeader title={t("title")} />
      <Divider />
      <CardContent>
        <Stack spacing={1}>
          <FormControl fullWidth>
            <InputLabel>{t("type")}</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} label={t("type")}>
                  <MenuItem value="DRAFT">{t("types.DRAFT")}</MenuItem>
                  <MenuItem value="INSTANT">{t("types.INSTANT")}</MenuItem>
                  <MenuItem value="SCHEDULED">{t("types.SCHEDULED")}</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          {type !== "SCHEDULED" && (
            <Alert color="info">
              {type === "DRAFT" ? t("alerts.DRAFT") : t("alerts.INSTANT")}
            </Alert>
          )}

          {type == "SCHEDULED" && (
            <FormControl fullWidth error={!!errors.scheduled_at}>
              <DateTimePicker
                label={t("scheduled_at")}
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
                  {t("constraints.range", {
                    start: dayjs(selectedEvent.start_at).format("DD/MM/YYYY"),
                    end: dayjs(selectedEvent.end_at).format("DD/MM/YYYY"),
                  })}
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
