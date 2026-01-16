import { NoteTwoTone } from "@mui/icons-material";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import type { SxProps } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import * as React from "react";

export interface ProfitCardProps {
  sx?: SxProps;
  value: string;
}

export function ProfitCard({
  value,
  sx,
}: Readonly<ProfitCardProps>): React.JSX.Element {
  const t = useTranslations("HISTORIES.detail.cards");
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          direction="row"
          sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {t("profit")}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "var(--mui-palette-info-main)",
              height: "56px",
              width: "56px",
            }}
          >
            <NoteTwoTone />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
