import { generateImageAction } from "@/actions/broadcast/generateImage";
import AppFooter from "@/layouts/App/Footer";
import {
  AiImagePromptSchema,
  AiImagePromptValues,
} from "@/schema/Broadcast/AiImage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircleTwoTone,
  RefreshTwoTone,
  SaveTwoTone,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
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

      <AppFooter
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="subtitle1" color="secondary">
          จัดการประชาสัมพันธ์
        </Typography>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<SaveTwoTone />}
            type="submit"
            form="stock-form"
            name="saveAndUpdate"
            disabled={disabled}
          >
            เผยแพร่
          </Button>
        </Stack>
      </AppFooter>
    </Stack>
  );
};

export default AiTab;
