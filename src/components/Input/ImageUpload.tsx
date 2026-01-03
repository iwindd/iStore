"use client";

import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface ImageUploadProps {
  value?: string | File | null;
  onChange: (value: string | File | null) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!value) {
      setPreviewUrl("");
      return;
    }

    if (typeof value === "string") {
      setPreviewUrl(value);
    } else if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);

      // Cleanup
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [value]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      // You might want to bubble this error up or handle it via a callback prop
      alert("กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    onChange(file);

    // Reset input
    e.target.value = "";
  };

  const handleRemove = () => {
    onChange(null);
  };

  if (previewUrl) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          position: "relative",
          overflow: "hidden",
          borderColor: theme.palette.divider,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            component="img"
            src={previewUrl}
            alt="Uploaded image"
            sx={{
              maxHeight: 300,
              maxWidth: "100%",
              borderRadius: 1,
              objectFit: "contain",
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={disabled}
            >
              เปลี่ยนรูปภาพ
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleRemove}
              disabled={disabled}
            >
              ลบรูปภาพ
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderStyle: "dashed",
        borderColor: theme.palette.divider,
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
        transition: "all 0.2s",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
      }}
    >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        <Box
          sx={{
            p: 2,
            borderRadius: "50%",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
          }}
        >
          <ImageIcon />
        </Box>
        <Typography variant="body2" color="text.secondary">
          อัพโหลดรูปภาพเพื่อใช้ในประกาศ (สูงสุด 5MB)
        </Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={disabled}
        >
          อัพโหลดรูปภาพ
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>
      </Stack>
    </Paper>
  );
};

export default ImageUpload;
