import { PermissionEnum } from "@/enums/permission";
import { Route } from "@/libs/route/route";

export type SidebarItem = (
  | Route
  | {
      key: string;
      title: string;
      routes: Route[];
      defaultExpand?: boolean;
    }
) & {
  needSomePermissions?: PermissionEnum[];
};

export * from "./overview";
export * from "./store";
