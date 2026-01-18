"use client";
import { Box, Card, CardContent, Skeleton, Stack } from "@mui/material";

const RelatedPromotionSkeleton = () => {
  return (
    <Stack spacing={1}>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Box flex={1.2} width="100%">
                <Skeleton
                  variant="text"
                  width={80}
                  height={16}
                  sx={{ mb: 1 }}
                />
                <Stack spacing={0.5}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="70%" height={20} />
                  <Skeleton variant="text" width="90%" height={20} />
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default RelatedPromotionSkeleton;
