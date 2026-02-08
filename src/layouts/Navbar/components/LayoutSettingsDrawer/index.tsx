"use client";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { setFontSize, setThemeMode } from "@/reducers/uiReducer";
import { Close, Contrast, DarkMode, TextFields } from "@mui/icons-material";
import {
  Box,
  Chip,
  Drawer,
  Grid,
  IconButton,
  Slider,
  Stack,
  Typography,
  useColorScheme,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import SettingCart from "./components/SettingCart";

interface LayoutSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Font size mapping: level 1-10 to actual px values
const fontSizeMap: Record<number, string> = {
  1: "0.75",
  2: "0.8125",
  3: "0.875",
  4: "0.9375",
  5: "1", // default
  6: "1.0625",
  7: "1.125",
  8: "1.1875",
  9: "1.25",
  10: "1.3125",
};

const LayoutSettingsDrawer = ({ open, onClose }: LayoutSettingsDrawerProps) => {
  const t = useTranslations("LAYOUT_SETTINGS");
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const fontSize = useAppSelector((state) => state.ui.fontSize);
  const { setMode } = useColorScheme();

  const isDarkMode = themeMode === "dark";

  // Sync Redux state with MUI color scheme
  useEffect(() => {
    setMode(themeMode);
  }, [themeMode, setMode]);

  // Apply font size to document root
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--font-scale",
      fontSizeMap[fontSize],
    );
  }, [fontSize]);

  const handleModeChange = (checked: boolean) => {
    dispatch(setThemeMode(checked ? "dark" : "light"));
  };

  const handleFontSizeChange = (_: Event, value: number | number[]) => {
    dispatch(setFontSize(value as number));
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 360 },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography variant="h6">{t("title")}</Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Settings Cards */}
        <Grid container spacing={2}>
          {/* Mode Toggle */}
          <Grid size={6}>
            <SettingCart
              title={t("mode.label")}
              icon={<DarkMode fontSize="medium" />}
              checked={isDarkMode}
              onChange={handleModeChange}
            />
          </Grid>
          {/* Contrast Toggle */}
          <Grid size={6}>
            <SettingCart
              title={t("contrast.label")}
              icon={<Contrast fontSize="medium" />}
              checked={false}
              onChange={() => {}}
              disabled
            />
          </Grid>
        </Grid>

        {/* Font Size Slider */}
        <Box sx={{ mt: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextFields fontSize="small" color="action" />
              <Typography variant="subtitle2">{t("fontSize.label")}</Typography>
            </Stack>
            <Chip
              size="small"
              label={`${fontSizeMap[fontSize]}x`}
              color="primary"
            />
          </Stack>
          <Slider
            value={fontSize}
            onChange={handleFontSizeChange}
            min={1}
            max={10}
            step={1}
            marks
            sx={{
              "& .MuiSlider-mark": {
                width: 4,
                height: 4,
                borderRadius: "50%",
              },
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default LayoutSettingsDrawer;
