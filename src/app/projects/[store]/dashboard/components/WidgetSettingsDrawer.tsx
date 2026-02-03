"use client";
import { Close, ExpandMore, QueryStats } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import DrawerStatsSetting from "./Settings/DrawerStatsSetting";

interface WidgetSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WidgetSettingsDrawer = ({ open, onClose }: WidgetSettingsDrawerProps) => {
  const t = useTranslations("DASHBOARD.widget_settings");
  const [expanded, setExpanded] = React.useState<string | false>("stats");

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 380 },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6">{t("title")}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Stack>

        {/* Stats Accordion */}
        <DrawerStatsSetting expanded={expanded} handleChange={handleChange} />

        {/* Analysis Accordion */}
        <Accordion
          expanded={expanded === "analysis"}
          onChange={handleChange("analysis")}
          disableGutters
          elevation={0}
          sx={{
            "&:before": { display: "none" },
            borderRadius: 1,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="analysis-content"
            id="analysis-header"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <QueryStats color="secondary" />
              <Typography>{t("categories.analysis")}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {t("categories.analysis_description")}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Drawer>
  );
};

export default WidgetSettingsDrawer;
