"use client";
import { useActiveRouteParams } from "@/hooks/useActiveRouteParams";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { getPath } from "@/router";
import { NavigateNextTwoTone } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";

const Breadcrumb = () => {
  const activeRouteTrail = useActiveRouteTrail().filter(
    (route) => !route.disabledBreadcrumb
  );
  const params = useActiveRouteParams();

  const items = activeRouteTrail.map((route, index) => {
    const isActive = index === activeRouteTrail.length - 1;

    return isActive ? (
      <Typography color="text.primary" key={route.name}>
        {route.label}
      </Typography>
    ) : (
      <Link
        underline="hover"
        color="inherit"
        href={getPath(route.name, params as Record<string, any>)}
        key={route.name}
      >
        {route.label}
      </Link>
    );
  });

  if (items.length <= 0) return null;

  return (
    <Breadcrumbs separator={<NavigateNextTwoTone fontSize="small" />}>
      <Link underline="hover" color="inherit" href={getPath("overview")}>
        ภาพรวม
      </Link>
      {items}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
