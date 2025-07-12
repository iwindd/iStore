"use client";
import React from "react";
import { NavigateNextTwoTone } from "@mui/icons-material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import PathConfig, { HomePath, PathType } from "@/config/Path";
const Path = Object.values(PathConfig) as PathType[];

const findRoute = (pathSegments: string[]) => {
  return Path.filter(path => !path.disableBreadcrumb).find((route) => {
    const routeSegments = route.href.split("/").filter((segment) => segment);
    if (routeSegments.length !== pathSegments.length) return false;
    return routeSegments.every((segment, index) => {
      return segment.startsWith(":") || segment === pathSegments[index];
    });
  });
};

const Breadcrumb = () => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumbs separator={<NavigateNextTwoTone fontSize="small" />}>
      <Link underline="hover" color="inherit" href={HomePath}>ภาพรวม</Link>

      {pathNames.map((_, index) => {
        const pathSegments = pathNames.slice(0, index + 1);
        const path = `/${pathSegments.join("/")}`;
        const route = findRoute(pathSegments);

        if (path == "/admin") return null;
        if (!route) return null;

        const isActive = pathNames.length === pathSegments.length;

        return !isActive ? (
          <Link underline="hover" color="inherit" href={path} key={route.key}>
            {route.title}
          </Link>
        ) : (
          <Typography color="text.primary" key={route.key}>
            {route.title}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
