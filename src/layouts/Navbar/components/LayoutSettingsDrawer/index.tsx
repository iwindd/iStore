"use client";

import { Close, Contrast, DarkMode, Refresh } from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import SettingCart from "./components/SettingCart";

interface LayoutSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const LayoutSettingsDrawer = ({ open, onClose }: LayoutSettingsDrawerProps) => {
  const t = useTranslations("LAYOUT_SETTINGS");

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
            <IconButton size="small">
              <Refresh fontSize="small" />
            </IconButton>
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
            />
          </Grid>
          {/* Contrast Toggle */}
          <Grid size={6}>
            <SettingCart
              title={t("contrast.label")}
              icon={<Contrast fontSize="medium" />}
            />
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default LayoutSettingsDrawer;
