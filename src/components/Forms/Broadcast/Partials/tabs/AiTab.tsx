import { generateImageAction } from "@/actions/broadcast/generateImage";
import {
  AiImagePromptSchema,
  AiImagePromptValues,
} from "@/schema/Broadcast/AiImage";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleTwoTone, Image, RefreshTwoTone } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageCardProps } from "../ImageCard";

const AiTab = ({ form, disabled: propsDisabled }: ImageCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentImageUrl = form.watch("image_url");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AiImagePromptValues>({
    resolver: zodResolver(AiImagePromptSchema),
  });

  const onGenerate = async (data: AiImagePromptValues) => {
    setIsGenerating(true);
    try {
      const result = await generateImageAction(data);
      if (result.success && result.imageUrl) {
        form.setValue("image_url", result.imageUrl);
        enqueueSnackbar("สร้างรูปภาพสำเร็จ", { variant: "success" });
      } else {
        throw new Error(result.message || "Failed to generate image");
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || "เกิดข้อผิดพลาดในการสร้างรูปภาพ", {
        variant: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const disabled = propsDisabled || isGenerating;

  return (
    <Stack spacing={2}>
      <Alert color="info">
        อธิบายรูปภาพที่คุณต้องการจะสร้าง
        คุณสามารถเพิ่มรูปอ้างอิงเพื่อให้ได้ผลลัพธ์ที่คุณต้องการ
      </Alert>

      <Box component="form" onSubmit={handleSubmit(onGenerate)}>
        <Stack spacing={2}>
          <TextField
            {...register("prompt")}
            label="อธิบายรูปภาพ"
            fullWidth
            multiline
            rows={4}
            disabled={disabled}
            error={!!errors.prompt}
            helperText={errors.prompt?.message}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            placeholder="เช่น: คูปองส่วนลดสำหรับสินค้าประเภทเบเกอรี่ มู้ดแอนด์โทนสีอุ่นๆ มีรูปขนมปังประกอบ..."
          />
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              type="submit"
              disabled={disabled}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={20} />
                ) : (
                  <RefreshTwoTone />
                )
              }
            >
              {isGenerating ? "กำลังสร้าง..." : "สร้างรูปภาพ"}
            </Button>
          </Stack>
        </Stack>
      </Box>

      {currentImageUrl && (
        <Stack spacing={1}>
          <Typography
            variant="subtitle2"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <CheckCircleTwoTone color="success" fontSize="small" />{" "}
            รูปภาพที่ถูกสร้างล่าสุด
          </Typography>
          <Box
            sx={{
              width: "100%",
              borderRadius: 1,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              aspectRatio: "16 / 9",
              position: "relative",
            }}
          >
            <img
              src={currentImageUrl}
              alt="Generated AI"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Stack>
      )}

      {/* Placeholder for future Image Reference feature */}
      <Stack>
        <InputLabel sx={{ mb: 1 }}>รูปภาพอ้างอิง (เร็วๆ นี้)</InputLabel>
        <Grid container>
          <Grid size={1}>
            <Button
              variant="dashed"
              color="secondary"
              disabled={true}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                aspectRatio: "1 / 1",
                width: "100%",
              }}
            >
              <Image fontSize="large" color="disabled" />
              <Typography color="text.secondary" variant="button">
                เพิ่ม
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default AiTab;
