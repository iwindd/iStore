import { MoneyTwoTone } from "@mui/icons-material";
import { Avatar, Card, CardContent, Stack, Typography } from "@mui/material";
import type { SxProps } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import * as React from "react";

export interface CostCardProps {
  sx?: SxProps;
  value: string;
}

export function CostCard({
  value,
  sx,
}: Readonly<CostCardProps>): React.JSX.Element {
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
              {t("cost")}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "var(--mui-palette-warning-main)",
              height: "56px",
              width: "56px",
            }}
          >
            <MoneyTwoTone />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}
