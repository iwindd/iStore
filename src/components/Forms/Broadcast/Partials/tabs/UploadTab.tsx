import { getPresignedUrl } from "@/actions/upload/getPresignedUrl";
import ImageUpload from "@/components/Input/ImageUpload";
import {
  Box,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { ImageCardProps } from "../ImageCard";

const UploadTab = ({
  form: {
    control,
    formState: { errors },
    setValue,
  },
  disabled,
}: ImageCardProps) => {
  const t = useTranslations("BROADCASTS.form");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (file: File | null) => {
    setSelectedImageFile(file);

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

        setValue("image_url", publicUrl);
      } catch (error) {
        console.error("Upload error:", error);
        enqueueSnackbar(t("sections.image.upload.error"), {
          variant: "error",
        });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (selectedImageFile) {
      handleImageChange(selectedImageFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageFile]);

  return (
    <Stack spacing={2}>
      <Controller
        name="image_url"
        control={control}
        disabled={disabled || isUploading}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.image_url}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t("sections.image.upload.label")}
              </Typography>
            </Box>
            <ImageUpload
              value={field.value}
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
  );
};

export default UploadTab;
