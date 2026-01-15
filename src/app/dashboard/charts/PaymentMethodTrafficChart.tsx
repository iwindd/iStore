"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ApexOptions } from "apexcharts";

import { getPaymentMethodTraffic } from "@/actions/dashboard/getPaymentMethodTraffic";
import { Chart } from "@/components/core/chart";
import { useAppSelector } from "@/hooks";
import { money } from "@/libs/formatter";
import { Box, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

export interface PaymentMethodTrafficChartProps {
  chartSeries: {
    percent: number;
    total: number;
  }[];
  labels: string[];
  sx?: SxProps;
}

export function PaymentMethodTrafficChart({
  chartSeries,
}: Readonly<PaymentMethodTrafficChartProps>) {
  const labels = ["เงินสด", "โอนเงิน"];
  const chartOptions = useChartOptions(labels);
  const range = useAppSelector((state) => state.dashboard.range);

  const { isLoading, ...query } = useQuery({
    queryKey: ["payment-method-traffic", range],
    queryFn: () => getPaymentMethodTraffic(range),
  });

  const result = query.data || [
    {
      count: 0,
      percent: 0,
    },
    {
      count: 0,
      percent: 0,
    },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="ช่องทางการชำระเงิน" />
      <CardContent>
        <Stack spacing={2}>
          <Box height={300}>
            <Chart
              height={"100%"}
              options={chartOptions}
              series={result.map((item) => item.percent) || []}
              type="donut"
              width="100%"
            />
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
            {result.map((item, index) => {
              const label = labels[index];
              return (
                <Stack key={label} sx={{ alignItems: "center" }}>
                  {isLoading ? (
                    <Stack>
                      <Skeleton variant="text" height={50} width={100} />
                    </Stack>
                  ) : (
                    <>
                      <Typography variant="h6">{label}</Typography>
                      <Typography color="text.secondary" variant="subtitle2">
                        {money(item.count)}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        lineHeight={0.5}
                        variant="caption"
                      >
                        ({item.percent.toFixed(2)}%)
                      </Typography>
                    </>
                  )}
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: "transparent" },
    colors: [
      theme.palette.success.main,
      theme.palette.primary.main,
      theme.palette.error.main,
    ],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: {
      active: { filter: { type: "none" } },
      hover: { filter: { type: "none" } },
    },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
