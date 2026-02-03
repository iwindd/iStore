"use client";
import HasStorePermission from "@/components/Flagments/HasStorePermission";
import { PermissionConfig } from "@/config/permissionConfig";
import { useRoute } from "@/hooks/use-route";
import {
  DashboardRange,
  EnumDashboardRange,
  setRange,
} from "@/reducers/dashboardReducer";
import {
  AnalyticsTwoTone,
  PrintTwoTone,
  RefreshTwoTone,
  SettingsTwoTone,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import WidgetSettingsDrawer from "./WidgetSettingsDrawer";

const DashboardController = () => {
  const t = useTranslations("DASHBOARD.controller");
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const range = useSelector((state: any) => state.dashboard.range);
  const [start, setStart] = React.useState<Dayjs | null>(dayjs(range.start));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs(range.end));
  const [isOpenCustomDialog, setIsOpenCustomDialog] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const route = useRoute();

  const handleRangeChange = (type: EnumDashboardRange | "custom") => {
    if (type === "custom") {
      setIsOpenCustomDialog(true);
      return;
    }

    let newStart = dayjs();
    let newEnd = dayjs().endOf("day");

    switch (type) {
      case EnumDashboardRange.TODAY:
        newStart = dayjs().startOf("day");
        break;
      case EnumDashboardRange.WEEK:
        newStart = dayjs().startOf("week");
        break;
      case EnumDashboardRange.MONTH:
        newStart = dayjs().startOf("month");
        break;
      case EnumDashboardRange.YEAR:
        newStart = dayjs().startOf("year");
        break;
      case EnumDashboardRange.ALL_TIME:
        newStart = dayjs(0);
        break;
    }

    const newRange: DashboardRange = {
      type,
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    };

    dispatch(setRange(newRange));
  };

  const handleRefresh = async () => {
    if (range.type === "custom") return handleRangeChange(range.type);
    queryClient.refetchQueries({
      queryKey: ["stats"],
    });
  };

  const setCustomRange = () => {
    if (!start || !end) return;

    const newRange: DashboardRange = {
      type: EnumDashboardRange.CUSTOM,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    dispatch(setRange(newRange));
    setIsOpenCustomDialog(false);
  };

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography variant="h4">{t("title")}</Typography>
        </Stack>

        <Stack direction={"row"} spacing={1} alignItems="center">
          <HasStorePermission
            permission={PermissionConfig.store.dashboard.viewOrderReport}
          >
            <Tooltip title={t("print")}>
              <IconButton
                color="secondary"
                component={Link}
                href={route.path("projects.store.dashboard.report")}
              >
                <PrintTwoTone />
              </IconButton>
            </Tooltip>
          </HasStorePermission>
          <Tooltip title={t("refresh")}>
            <IconButton color="secondary" onClick={handleRefresh}>
              <RefreshTwoTone />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("settings")}>
            <IconButton
              color="secondary"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsTwoTone />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="range-select-label">{t("range.label")}</InputLabel>
            <Select
              variant="outlined"
              labelId="range-select-label"
              value={range.type}
              label={t("range.label")}
              sx={{
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              onChange={(e) =>
                handleRangeChange(
                  e.target.value as EnumDashboardRange | "custom",
                )
              }
            >
              <MenuItem value={EnumDashboardRange.TODAY}>
                {t("range.today")}
              </MenuItem>
              <MenuItem value={EnumDashboardRange.WEEK}>
                {t("range.this_week")}
              </MenuItem>
              <MenuItem value={EnumDashboardRange.MONTH}>
                {t("range.this_month")}
              </MenuItem>
              <MenuItem value={EnumDashboardRange.YEAR}>
                {t("range.this_year")}
              </MenuItem>
              <MenuItem value={EnumDashboardRange.ALL_TIME}>
                {t("range.all_time")}
              </MenuItem>
              <MenuItem value={EnumDashboardRange.CUSTOM}>
                {t("range.custom")}
              </MenuItem>
            </Select>
            <FormHelperText>
              {range.type === EnumDashboardRange.CUSTOM
                ? `${dayjs(range.start).format("DD/MM/YYYY")} - ${dayjs(range.end).format("DD/MM/YYYY")}`
                : ""}
            </FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
      <Dialog
        open={isOpenCustomDialog}
        onClose={() => setIsOpenCustomDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {t("custom_dialog.title")}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DatePicker
              value={start}
              format="DD/MM/YYYY"
              onChange={(data) => setStart(data)}
              label={t("custom_dialog.start")}
              disableFuture
            />
            <DatePicker
              value={end}
              format="DD/MM/YYYY"
              onChange={(data) => setEnd(data)}
              label={t("custom_dialog.end")}
              disableFuture
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            color="inherit"
            onClick={() => setIsOpenCustomDialog(false)}
          >
            {t("custom_dialog.close")}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AnalyticsTwoTone />}
            onClick={setCustomRange}
          >
            {t("custom_dialog.analyze")}
          </Button>
        </DialogActions>
      </Dialog>
      <WidgetSettingsDrawer
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default DashboardController;
