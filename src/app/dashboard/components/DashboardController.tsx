"use client";
import {
  DashboardRange,
  EnumDashboardRange,
  setRange,
} from "@/reducers/dashboardReducer";
import { getPath } from "@/router";
import {
  AnalyticsTwoTone,
  PrintTwoTone,
  RefreshTwoTone,
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
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardController = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const range = useSelector((state: any) => state.dashboard.range);
  const [start, setStart] = React.useState<Dayjs | null>(dayjs(range.start));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs(range.end));
  const [isOpenCustomDialog, setIsOpenCustomDialog] = React.useState(false);

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
          <Typography variant="h5">ภาพรวม</Typography>
        </Stack>

        <Stack direction={"row"} spacing={1} alignItems="center">
          <Tooltip title="พิมพ์">
            <IconButton
              color="secondary"
              component={Link}
              href={getPath("overview.dashboard.report")}
            >
              <PrintTwoTone />
            </IconButton>
          </Tooltip>
          <Tooltip title="รีเฟรช">
            <IconButton color="secondary" onClick={handleRefresh}>
              <RefreshTwoTone />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="range-select-label">ช่วงเวลา</InputLabel>
            <Select
              variant="outlined"
              labelId="range-select-label"
              value={range.type}
              label="ช่วงเวลา"
              sx={{
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              onChange={(e) =>
                handleRangeChange(
                  e.target.value as EnumDashboardRange | "custom"
                )
              }
            >
              <MenuItem value={EnumDashboardRange.TODAY}>วันนี้</MenuItem>
              <MenuItem value={EnumDashboardRange.WEEK}>อาทิตย์นี้</MenuItem>
              <MenuItem value={EnumDashboardRange.MONTH}>เดือนนี้</MenuItem>
              <MenuItem value={EnumDashboardRange.YEAR}>ปีนี้</MenuItem>
              <MenuItem value={EnumDashboardRange.CUSTOM}>กำหนดเอง</MenuItem>
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
        <DialogTitle sx={{ m: 0, p: 2 }}>กำหนดช่วงเวลา</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DatePicker
              value={start}
              format="DD/MM/YYYY"
              onChange={(data) => setStart(data)}
              label="วันเริ่มต้น"
              disableFuture
            />
            <DatePicker
              value={end}
              format="DD/MM/YYYY"
              onChange={(data) => setEnd(data)}
              label="สิ้นสุด"
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
            ปิด
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<AnalyticsTwoTone />}
            onClick={setCustomRange}
          >
            สรุปผล
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DashboardController;
