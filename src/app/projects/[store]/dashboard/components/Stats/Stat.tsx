import { useAppSelector } from "@/hooks";
import { Link, Skeleton } from "@mui/material";
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
  loading?: boolean;
}

export function TotalStat({
  value,
  sx,
  label,
  color,
  icon,
  href,
  loading,
}: Readonly<TotalStatProps>): React.JSX.Element {
  const mode = useAppSelector((state) => state.ui.themeMode);

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
              {loading ? (
                <>
                  <Skeleton width={80} />
                  <Skeleton width={120} height={32} />
                </>
              ) : (
                <>
                  <Typography color="text.secondary" variant="overline">
                    {label}
                  </Typography>
                  <Typography variant="h4">{value}</Typography>
                </>
              )}
            </Stack>
            <Avatar
              sx={{
                backgroundColor: `var(--mui-palette-${color}-${mode})`,
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
