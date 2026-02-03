"use client";
import { getYearlyAuthSales } from "@/actions/dashboard/getYearlyAuthSales";
import YearlyChart from "@/components/Charts/YearlyChart";
import useStoreAuthOrderAge from "@/hooks/useStoreAuthOrderAge";
import { Box, MenuItem, Select, Skeleton } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export interface AuthYearlySalesChartProps {
  sx?: SxProps;
}

export function AuthYearlySalesChart({
  sx,
}: Readonly<AuthYearlySalesChartProps>) {
  const t = useTranslations("DASHBOARD.auth_yearly_sales");
  const f = useFormatter();
  const authOrderAge = useStoreAuthOrderAge();
  const [selectedYear, setSelectedYear] = useState(authOrderAge.currentYear);
  const params = useParams<{ store: string }>();

  // Fetch yearly sales data
  const { data, isLoading } = useQuery({
    queryKey: ["auth-yearly-sales", selectedYear],
    queryFn: () => getYearlyAuthSales(params.store, selectedYear),
  });

  const chartSeries = [
    {
      name: t("orders"),
      data: data?.monthlyCount || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        title={t("title")}
        subheader={
          percentChange != 0 &&
          (isLoading ? (
            <Skeleton variant="text" height={20} width={250} />
          ) : (
            t("comparison", { percent: percentText })
          ))
        }
        action={
          authOrderAge.isLoading ? (
            <Skeleton variant="text" height={55} width={70} />
          ) : (
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              size="small"
            >
              {authOrderAge.data.years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          )
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
                  {t("orders")}
                </Typography>
              </Stack>
              {isLoading && <Skeleton variant="text" height={35} />}
              {!isLoading && (
                <Typography variant="h5">
                  {f.number(data?.totalCount || 0, "currency")}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Box
            sx={{
              height: 300,
            }}
          >
            <YearlyChart series={chartSeries} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
