"use client";
import { AnalyticsTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Modal,
  Popover,
  Stack,
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { RangeChange } from "@/actions/dashboard/range";
import { usePopover } from "@/hooks/use-popover";
import { date2 as date } from "@/libs/formatter";
import Link from "next/link";
import Paths from "@/config/Path";

const Range = ({
  savedStart,
  savedEnd,
}: {
  savedStart: string | null;
  savedEnd: string | null;
}) => {
  savedStart = savedStart || dayjs().subtract(1, "month").format();
  savedEnd = savedEnd || dayjs().format();
  const [start, setStart] = React.useState<Dayjs | null>(dayjs(savedStart));
  const [end, setEnd] = React.useState<Dayjs | null>(dayjs(savedEnd));
  const [isOpenCustomDialog, setIsOpenCustomDialog] = React.useState(false);
  const popover = usePopover<HTMLButtonElement>();  

  const setDateRange = async (start?: Dayjs | null, end?: Dayjs | null) => {
    try {
      start = start || dayjs().subtract(1, "month");
      end = end || dayjs();
      popover.handleClose();
      setIsOpenCustomDialog(false);
      setStart(start);
      setEnd(end);
      await RangeChange(start?.format(), end?.format());
      enqueueSnackbar("เปลี่ยนช่วงเวลาเรียบร้อยแล้ว!", { variant: "success" });
    } catch (error) {
      setStart(dayjs(savedStart));
      setEnd(dayjs(savedEnd));
      enqueueSnackbar("ไม่สามารถเปลี่ยนช่วงเวลาได้", { variant: "error" });
    }
  };

  const setDateRangeFromNow = (days: number) => {
    popover.handleClose();
    const now = dayjs();
    setDateRange(now.subtract(days, "day"), now.endOf("day"));
  };

  return (
    <>
      <Card>
        <CardHeader
          title="ภาพรวม"
          subheader={`
            ช่วงเวลา ${date(start?.toDate() || new Date())} 
            ถึง ${date(end?.toDate() || new Date())}
          `}
          action={
            <Stack
              direction={"row"}
              spacing={1}
            >
              <Button 
                color="inherit"
                component={Link}
                href={Paths["overview.report"].href}
              >
                พิมพ์
              </Button>
              <div>
                <Tooltip title="สรุปผล">
                  <Button
                    variant="contained"
                    onClick={popover.handleOpen}
                    ref={popover.anchorRef}
                    startIcon={<AnalyticsTwoTone />}
                  >
                    เลือกวันที่
                  </Button>
                </Tooltip>
                <Popover
                  anchorEl={popover.anchorRef.current}
                  onClose={popover.handleClose}
                  open={popover.open}
                  anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                >
                  <MenuItem
                    onClick={() =>
                      setDateRange(dayjs().startOf("day"), dayjs().endOf("day"))
                    }
                  >
                    วันนี้
                  </MenuItem>
                  <MenuItem onClick={() => setDateRangeFromNow(7)}>
                    7 วันล่าสุด
                  </MenuItem>
                  <MenuItem onClick={() => setDateRangeFromNow(30)}>
                    30 วันล่าสุด
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setIsOpenCustomDialog(true);
                    popover.handleClose();
                  }}>
                    กำหนดเอง
                  </MenuItem>
                </Popover>
              </div>
            </Stack>
          }
        />
      </Card>
      <>
        <Dialog
          open={isOpenCustomDialog}
          onClose={() => setIsOpenCustomDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>กำหนดช่วงเวลา</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <DatePicker
                value={start}
                name="start"
                format="DD/MM/YYYY"
                onChange={(data) => setStart(data)}
                label="วันเริมต้น"
                disableFuture
              />
              <DatePicker
                value={end}
                name="end"
                format="DD/MM/YYYY"
                onChange={(data) => setEnd(data)}
                label="สิ้นสุด"
                disableFuture
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="text" color="inherit" onClick={() => setIsOpenCustomDialog(false)}>ปิด</Button>
            <Button autoFocus variant="contained" color="success" startIcon={<AnalyticsTwoTone />} onClick={() => setDateRange(start, end)}>สรุปผล</Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};

export default Range;
