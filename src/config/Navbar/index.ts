import { Route } from "@/libs/route/route";

export type SidebarItem =
  | Route
  | {
      key: string;
      title: string;
      routes: Route[];
      defaultExpand?: boolean;
    };

export * from "./overview";
export * from "./store";
