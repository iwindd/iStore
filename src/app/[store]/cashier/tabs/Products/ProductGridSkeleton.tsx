"use client";
import { Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton = ({ count = 12 }: ProductGridSkeletonProps) => {
  return (
    <Grid container spacing={1}>
      {Array.from({ length: count }).map((_) => (
        <Grid size={3} key={crypto.randomUUID()}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="50%" height={16} />
                <div style={{ flexGrow: 1, minHeight: 8 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Skeleton variant="text" width={80} height={32} />
                  <Skeleton variant="circular" width={40} height={40} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGridSkeleton;
