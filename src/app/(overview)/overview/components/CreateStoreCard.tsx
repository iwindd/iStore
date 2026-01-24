"use client";

import { getPath } from "@/router";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

export default function CreateStoreCard() {
  const t = useTranslations("OVERVIEW.create_card");

  return (
    <Card variant="outlined">
      <CardActionArea href={getPath("overview.new")}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              +
            </Stack>
            <div>
              <Typography variant="subtitle1" fontWeight={600}>
                {t("title")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("description")}
              </Typography>
            </div>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
