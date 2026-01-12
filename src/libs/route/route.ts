import { compile, match } from "path-to-regexp";

type BaseRoute = {
  path: string;
  label: string;
  icon?: any;
  parent?: string;
  disabled?: boolean;
  disabledBreadcrumb?: boolean;
};

export type CFG_ROUTE = BaseRoute & {
  name?: string;
  children?: Record<string, CFG_ROUTE>;
};

export type Route = BaseRoute & {
  name: string;
};

export const ROUTER = (
  ROUTES: Record<string, CFG_ROUTE>
): Record<string, Route> => {
  const APP_ROUTES: Record<string, Route> = {};

  function traverse(
    routes: Record<string, CFG_ROUTE>,
    parentKey: string | null = null
  ) {
    for (const key in routes) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const routeName = routes[key].name || fullKey;
      routes[key].name = routeName;

      const route = {
        ...routes[key],
        name: routeName,
        label: routes[key].label || routeName,
        parent: parentKey,
      } as Route;

      delete (route as CFG_ROUTE).children;
      APP_ROUTES[fullKey] = route;
      if (routes[key].children) traverse(routes[key].children, fullKey);
    }
  }

  traverse({ ...ROUTES });

  return APP_ROUTES;
};

export const buildRouteUtility = (ROUTES: Record<string, Route>) => {
  const getRoute = (routeName: string) => {
    const findRouteByKey = ROUTES[routeName];
    const findRouteByName = Object.values(ROUTES).find(
      (r) => r.name === routeName
    );
    const route = findRouteByKey ?? findRouteByName;
    if (!route) throw new Error(`Route not found: ${routeName}`);

    return route;
  };

  const getPath = (routeName: string, params?: Record<string, any>) => {
    const route = getRoute(routeName);
    const toPath = compile(route.path);
    return toPath(params || {});
  };

  const getParamsFromPath = (routeName: string, pathname: string) => {
    const route = getRoute(routeName);
    const matcher = match(route.path);
    const matchResult = matcher(pathname);
    if (!matchResult || !matchResult.params) return {};
    return matchResult.params;
  };

  const findRouteTrail = (pathname: string) => {
    for (const key in ROUTES) {
      const route = ROUTES[key];
      const matcher = match(route.path);

      if (matcher(pathname)) {
        const trail: Route[] = [route];

        let parentKey = route.parent;
        while (parentKey) {
          const parentRoute = ROUTES[parentKey];
          if (parentRoute) {
            trail.unshift(parentRoute);
            parentKey = parentRoute.parent;
          } else {
            break;
          }
        }

        return trail;
      }
    }
    return null;
  };

  const findActiveRoute = (pathname: string) => {
    for (const route of Object.values(ROUTES)) {
      const matcher = match(route.path);
      if (matcher(pathname)) return route;
    }
    return null;
  };

  return {
    getRoute,
    getPath,
    getParamsFromPath,
    findRouteTrail,
    findActiveRoute,
  };
};
