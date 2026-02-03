"use client";
import { usePermission } from "@/providers/PermissionProvider";

interface IfNotHasStorePermissionProps {
  children: React.ReactNode;
  permission: string | string[];
  some?: boolean;
}

const IfNotHasStorePermission = ({
  children,
  permission,
  some = false,
}: IfNotHasStorePermissionProps) => {
  if (Array.isArray(permission) && permission.length <= 0) {
    return children;
  }

  const { hasStorePermission } = usePermission();

  return hasStorePermission(permission, some) ? null : children;
};

export default IfNotHasStorePermission;
