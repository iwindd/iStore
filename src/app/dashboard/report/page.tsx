"use client";

import { getOrdersSummary } from "@/actions/dashboard/getOrdersSummary";
import { useAppSelector } from "@/hooks";
import { LinearProgress, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Viewer from "./viewer";

const DashboardReport = () => {
  const range = useAppSelector((state) => state.dashboard.range);
  const query = useQuery({
    queryKey: ["ordersSummary", range],
    queryFn: () => getOrdersSummary(range),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return (
    <div>
      {query.isLoading ? (
        <Stack>
          <LinearProgress />
        </Stack>
      ) : (
        <Viewer
          products={query.data?.products ?? []}
          cashTotal={query.data?.cashTotal ?? 0}
          transferTotal={query.data?.transferTotal ?? 0}
          startDate={dayjs(range.start).format()}
          endDate={dayjs(range.end).format()}
        />
      )}
    </div>
  );
};

export default DashboardReport;
