import { Chart } from "@/components/core/chart";
import { useTheme } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";

const YearlyChart = ({
  series,
}: {
  series: { name: string; data: number[] }[];
}) => {
  const t = useTranslations("COMPONENTS.charts.yearly_chart");
  const chartOptions = useChartOptions([
    t("months.short.jan"),
    t("months.short.feb"),
    t("months.short.mar"),
    t("months.short.apr"),
    t("months.short.may"),
    t("months.short.jun"),
    t("months.short.jul"),
    t("months.short.aug"),
    t("months.short.sep"),
    t("months.short.oct"),
    t("months.short.nov"),
    t("months.short.dec"),
  ]);

  return (
    <Chart
      options={chartOptions}
      series={series}
      type="area"
      height="100%"
      width="100%"
    />
  );
};

function useChartOptions(months: string[]): ApexOptions {
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
      categories: months,
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

export default YearlyChart;
