"use client";

import { createContext, useContext, useMemo } from "react";

const PermissionContext = createContext<{
  globalPermissions: string[];
  storePermissions: string[];
  hasGlobalPermission: (
    permission: string | string[],
    some?: boolean,
  ) => boolean;
  hasStorePermission: (
    permission: string | string[],
    some?: boolean,
  ) => boolean;
} | null>(null);

const PermissionProvider = ({
  children,
  globalPermissions,
  storePermissions,
}: {
  children: React.ReactNode;
  globalPermissions: string[];
  storePermissions: string[];
}) => {
  const hasGlobalPermission = (
    permission: string | string[],
    some: boolean = false,
  ) => {
    const hasPermission =
      typeof permission === "string"
        ? globalPermissions.includes(permission)
        : some
          ? globalPermissions.some((p) => permission.includes(p))
          : globalPermissions.every((p) => permission.includes(p));

    return hasPermission;
  };

  const hasStorePermission = (
    permission: string | string[],
    some: boolean = false,
  ) => {
    const hasPermission =
      typeof permission === "string"
        ? storePermissions.includes(permission)
        : some
          ? storePermissions.some((p) => permission.includes(p))
          : storePermissions.every((p) => permission.includes(p));

    return hasPermission;
  };

  const value = useMemo(() => {
    return {
      globalPermissions: globalPermissions || [],
      storePermissions: storePermissions || [],
      hasGlobalPermission,
      hasStorePermission,
    };
  }, [
    globalPermissions,
    storePermissions,
    hasGlobalPermission,
    hasStorePermission,
  ]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context)
    throw new Error("usePermission must be used within PermissionProvider");
  return context;
};

export default PermissionProvider;
