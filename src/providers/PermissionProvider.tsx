"use client";

import { createContext, useContext, useMemo } from "react";

const PermissionContext = createContext<{
  globalPermissions: { id: number; name: string }[];
  storePermissions: { id: number; name: string }[];
} | null>(null);

const PermissionProvider = ({
  children,
  globalPermissions,
  storePermissions,
}: {
  children: React.ReactNode;
  globalPermissions: { id: number; name: string }[];
  storePermissions: { id: number; name: string }[];
}) => {
  const value = useMemo(() => {
    return {
      globalPermissions: globalPermissions || [],
      storePermissions: storePermissions || [],
    };
  }, [globalPermissions, storePermissions]);

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
