"use client";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";

const OrderSummarySkeleton = () => {
  return (
    <Stack spacing={3}>
      {/* Summary Cards */}
      <Stack direction="row" spacing={2}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ flex: 1 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="80%" height={40} />
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Order Info Card */}
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {[1, 2, 3, 4].map((i) => (
              <Stack key={i} direction="row" spacing={2}>
                <Skeleton variant="text" width="20%" height={24} />
                <Skeleton variant="text" width="40%" height={24} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Datatable Skeleton */}
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
          <Stack spacing={1}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" height={52} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default OrderSummarySkeleton;
