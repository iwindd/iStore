import { Link } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import RouterLink from "next/link";
import * as React from "react";

export interface TotalStatProps {
  sx?: SxProps;
  value: string;
  label: string;
  color:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  icon: React.ReactNode;
  href?: string;
}

export function TotalStat({
  value,
  sx,
  label,
  color,
  icon,
  href,
}: Readonly<TotalStatProps>): React.JSX.Element {
  return (
    <Link
      component={(href && RouterLink) || "div"}
      href={href || "/"}
      underline="none"
    >
      <Card sx={sx}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {label}
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: `var(--mui-palette-${color}-main)`,
                height: "56px",
                width: "56px",
              }}
            >
              {icon}
            </Avatar>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  );
}
