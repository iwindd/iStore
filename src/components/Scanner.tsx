"use client";
import { KeyboardReturn, QrCodeScanner } from "@mui/icons-material";
import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface ScannerProps {
  onSubmit(serial: string): void;
}

const Scanner = (props: ScannerProps) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ref.current) {
      const value = ref.current.value;
      console.log(value);
      props.onSubmit(value);
      ref.current.focus();
      ref.current.value = "";
    }
  };

  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, [ref]);

  return (
    <form onSubmit={onSubmit}>
      <TextField
        autoFocus
        fullWidth
        placeholder="รหัสสินค้า / สแกนสินค้า..."
        variant="outlined"
        inputRef={ref}
        slotProps={{
          input: {
            startAdornment: (
              <Box sx={{ color: "primary.main", mr: 1, display: "flex" }}>
                <QrCodeScanner />
              </Box>
            ),
            endAdornment: (
              <Box
                sx={{
                  display: { xs: "none", xl: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.5,
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <KeyboardReturn fontSize="small" color="disabled" />
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Enter
                </Typography>
              </Box>
            ),
          },
        }}
      />

      <input type="submit" hidden />
    </form>
  );
};

export default Scanner;
