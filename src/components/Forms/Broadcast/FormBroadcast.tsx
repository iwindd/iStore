import { EventSelectorItem } from "@/actions/broadcast/eventActions";
import { generateAdMessage } from "@/actions/broadcast/generateMessage";
import { getPresignedUrl } from "@/actions/upload/getPresignedUrl";
import ImageUpload from "@/components/Input/ImageUpload";
import EventSelector from "@/components/Selector/EventSelector";
import useFormValidate from "@/hooks/useFormValidate";
import {
  CreateBroadcastSchema,
  CreateBroadcastValues,
} from "@/schema/Broadcast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutoAwesomeTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

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
    control,
  } = useFormValidate<CreateBroadcastValues>({
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

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFormSubmit = async (data: CreateBroadcastValues) => {
    let finalImageUrl = data.image_url;

    if (selectedImageFile) {
      setIsUploading(true);
      try {
        const { signedUrl, publicUrl } = await getPresignedUrl(
          selectedImageFile.name,
          selectedImageFile.type
        );

        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: selectedImageFile,
          headers: {
            "Content-Type": selectedImageFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Upload failed");
        }

        finalImageUrl = publicUrl;
      } catch (error) {
        console.error("Upload error:", error);
        enqueueSnackbar("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ", {
          variant: "error",
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

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

  const selectedEventId = watch("event_id");
  const scheduledAt = watch("scheduled_at");
  const type = watch("type");

  // Track selected event for date constraints
  const [selectedEvent, setSelectedEvent] =
    React.useState<EventSelectorItem | null>(null);

  const disabled = isLoading || propsDisabled || isUploading;

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
    <Stack
      spacing={2}
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Card>
        <CardHeader title="เลือกโปรโมชั่น" />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
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
            <TextField
              label="หัวข้อประกาศ"
              fullWidth
              disabled={disabled}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title")}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="ข้อมูล"
          action={
            <Tooltip title="สร้างรายละเอียดข้อเสนออัตโนมัติ">
              <IconButton
                color="primary"
                disabled={
                  aiGeneratePromotionOfferInfo.isPending ||
                  disabled ||
                  !selectedEventId
                }
                onClick={() =>
                  aiGeneratePromotionOfferInfo.mutate(selectedEventId)
                }
              >
                <AutoAwesomeTwoTone />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="ข้อความประกาศ"
              fullWidth
              multiline
              rows={4}
              disabled={disabled || aiGeneratePromotionOfferInfo.isPending}
              error={!!errors.message}
              helperText={errors.message?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              placeholder="ข้อความแจ้งเตือน eg.โปรเด็ด! ซื้อโค้ก 2 ขวด แถมฟรีอีก 1 ขวดทันที คุ้มสองต่อ รสชาติซ่าที่คุณรักในราคาเกินคุ้ม หมดเขตเร็วๆ นี้"
              {...register("message")}
            />
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.image_url}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      รูปภาพประกอบ (ถ้ามี)
                    </Typography>
                  </Box>
                  <ImageUpload
                    value={selectedImageFile || field.value}
                    onChange={(val) => {
                      if (val instanceof File) {
                        setSelectedImageFile(val);
                      } else {
                        setSelectedImageFile(null);
                        field.onChange(val || "");
                      }
                    }}
                    disabled={disabled}
                  />
                  {errors.image_url && (
                    <FormHelperText>{errors.image_url.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="การเผยแพร่" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, md: type === "SCHEDULED" ? 4 : 8 }}>
              <FormControl fullWidth>
                <InputLabel>รูปแบบการเผยแพร่</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="รูปแบบการเผยแพร่">
                      <MenuItem value="DRAFT">บันทึกแบบร่าง (Draft)</MenuItem>
                      <MenuItem value="INSTANT">ส่งทันที (Instant)</MenuItem>
                      <MenuItem value="SCHEDULED">
                        ตั้งเวลา (Scheduled)
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              {type !== "SCHEDULED" && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {type === "DRAFT"
                    ? "บันทึกเป็นแบบร่าง จะยังไม่มีการส่ง Broadcast"
                    : "ระบบจะส่ง Broadcast ทันทีหลังจากกดบันทึก"}
                </Typography>
              )}
            </Grid>

            {type === "SCHEDULED" && (
              <Grid size={{ xs: 12, md: 4 }}>
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
                    <FormHelperText>
                      {errors.scheduled_at.message}
                    </FormHelperText>
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
            )}

            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                fullWidth
                startIcon={<SaveTwoTone />}
                disabled={disabled}
                sx={{ height: 56 }}
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

export default FormBroadcast;
