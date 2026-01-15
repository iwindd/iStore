"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import type { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { getOldestOrder } from "@/actions/dashboard/getOldestOrder";
import { getYearlySales } from "@/actions/dashboard/getYearlySales";
import { Chart } from "@/components/core/chart";
import { money } from "@/libs/formatter";
import { Box, MenuItem, Select, Skeleton } from "@mui/material";

export interface YearlySalesChartProps {
  sx?: SxProps;
}

const MONTHS_TH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export function YearlySalesChart({ sx }: Readonly<YearlySalesChartProps>) {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([currentYear]);

  // Fetch oldest order to determine available years
  const { data: oldestOrderDate } = useQuery({
    queryKey: ["oldest-order"],
    queryFn: getOldestOrder,
  });

  // Update available years when oldest order is loaded
  useEffect(() => {
    if (oldestOrderDate) {
      const oldestYear = dayjs(oldestOrderDate).year();
      const years: number[] = [];
      for (let year = currentYear; year >= oldestYear; year--) {
        years.push(year);
      }
      setAvailableYears(years);
    }
  }, [oldestOrderDate, currentYear]);

  // Fetch yearly sales data
  const { data, isLoading } = useQuery({
    queryKey: ["yearly-sales", selectedYear],
    queryFn: () => getYearlySales(selectedYear),
  });

  const chartOptions = useChartOptions();

  const chartSeries = [
    {
      name: "รายรับ",
      data: data?.monthlyIncome || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "ค่าใช้จ่าย",
      data: data?.monthlyExpenses || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const percentChange = data?.yearOverYearChange || 0;
  const percentText =
    percentChange >= 0
      ? `+${percentChange.toFixed(0)}%`
      : `${percentChange.toFixed(0)}%`;

  return (
    <Card sx={sx}>
      <CardHeader
        title="ยอดขายรายปี"
        subheader={
          isLoading ? (
            <Skeleton variant="text" height={20} width={250} />
          ) : (
            percentText + " เมื่อเทียบกับปีที่แล้ว"
          )
        }
        action={
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            size="small"
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        }
      />
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "var(--mui-palette-success-main)",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                  }}
                />
                <Typography color="text.secondary" variant="body2">
                  รายรับทั้งหมด
                </Typography>
              </Stack>
              {isLoading && <Skeleton variant="text" height={35} />}
              {!isLoading && (
                <Typography variant="h5">
                  {money(data?.totalIncome || 0)}
                </Typography>
              )}
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: "var(--mui-palette-warning-main)",
                    borderRadius: "50%",
                    height: 8,
                    width: 8,
                  }}
                />
                <Typography color="text.secondary" variant="body2">
                  ค่าใช้จ่ายทั้งหมด
                </Typography>
              </Stack>
              {isLoading && <Skeleton variant="text" height={35} />}
              {!isLoading && (
                <Typography variant="h5">
                  {money(data?.totalExpenses || 0)}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Box
            sx={{
              height: 300,
            }}
          >
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="100%"
              width="100%"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: [theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    fill: {
      gradient: {
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
      type: "gradient",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    markers: {
      size: 0,
      strokeColors: theme.palette.background.paper,
      strokeWidth: 3,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: MONTHS_TH,
      labels: {
        offsetY: 5,
        style: { colors: theme.palette.text.secondary },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value.toFixed(0)}฿` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
