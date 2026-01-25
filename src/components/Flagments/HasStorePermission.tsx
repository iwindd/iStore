"use client";
import { usePermission } from "@/providers/PermissionProvider";

interface HasStorePermissionProps {
  children: React.ReactNode;
  permission: string | string[];
  some?: boolean;
}

const HasStorePermission = ({
  children,
  permission,
  some = false,
}: HasStorePermissionProps) => {
  if (Array.isArray(permission) && permission.length <= 0) {
    return children;
  }

  const { hasStorePermission } = usePermission();

  return hasStorePermission(permission, some) ? children : null;
};

export default HasStorePermission;
