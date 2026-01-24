"use client";
import { useActiveRouteParams } from "@/hooks/useActiveRouteParams";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
import { Route } from "@/libs/route/route";
import { getPath } from "@/router";
import { NavigateNextTwoTone } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const Breadcrumb = () => {
  const t = useTranslations("ROUTES");
  const activeRouteTrail = useActiveRouteTrail().filter(
    (route: Route) => !route.disabledBreadcrumb,
  );
  const params = useActiveRouteParams();

  const items = activeRouteTrail.map((route: Route, index: number) => {
    const isActive = index === activeRouteTrail.length - 1;

    return isActive ? (
      <Typography color="text.primary" key={route.name}>
        {t(route.label)}
      </Typography>
    ) : (
      <Link
        underline="hover"
        color="inherit"
        href={getPath(route.name, params as Record<string, any>)}
        key={route.name}
      >
        {t(route.label)}
      </Link>
    );
  });

  if (items.length <= 1) return null;

  return (
    <Breadcrumbs separator={<NavigateNextTwoTone fontSize="small" />}>
      <div></div>
      {items}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
